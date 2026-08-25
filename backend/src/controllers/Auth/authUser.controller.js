import crypto from "crypto";

import { env } from "../../config/env.js";
import { GuideProfile } from "../../models/guide.model.js";
import { GuideVerification } from "../../models/guideVerification.model.js";
import { TouristProfile } from "../../models/tourist.model.js";
import { REGISTER_ROLES, User, USER_ROLES } from "../../models/user.model.js";
import { clearAuthCookie, setAuthCookie } from "../../utils/authSession.js";
import {
  buildVerificationEmail,
  buildWelcomeEmail,
} from "../../utils/authEmailTemplates.js";
import { generateToken } from "../../utils/generateToken.js";
import { verifyGoogleIdToken } from "../../utils/googleIdToken.js";
import { sendEmail } from "../../utils/sendEmail.js";
import {
  createTemporaryAuthToken,
  verifyTemporaryAuthToken,
} from "../../utils/temporaryAuthToken.js";

const EMAIL_VERIFICATION_TTL_MS = 30 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 10 * 60 * 1000;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function hasLocalProvider(user) {
  const providers = user?.authProviders || [];
  // Accounts created before provider tracking was introduced are local accounts.
  return providers.length === 0 || providers.includes("local");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findUserByCanonicalEmail(
  email,
  { excludeUserId, requireLocal = false } = {},
) {
  const normalizedEmail = normalizeEmail(email);
  const query = {
    email: {
      $regex: new RegExp(`^\\s*${escapeRegExp(normalizedEmail)}\\s*$`, "i"),
    },
    status: { $ne: "deactivated" },
  };

  if (excludeUserId) query._id = { $ne: excludeUserId };
  if (requireLocal) {
    query.$or = [
      { authProviders: "local" },
      { authProviders: { $exists: false } },
      { authProviders: { $size: 0 } },
    ];
  }

  return User.findOne(query).select(
    "+password +googleSub +tokenVersion +mergedInto +mergedAt +emailVerificationToken +emailVerificationExpires +passwordResetToken +passwordResetExpires",
  );
}

function getGoogleProfile(payload) {
  const email = normalizeEmail(payload.email);
  const locale = String(payload.locale || "").trim().slice(0, 20);

  return {
    email,
    googleSub: String(payload.sub),
    fullName: String(payload.name || email.split("@")[0]).trim(),
    avatar: typeof payload.picture === "string" ? payload.picture : "",
    preferredLanguage: locale || "en",
  };
}

function serializeUser(user) {
  const providers = user.authProviders?.length
    ? user.authProviders
    : hasLocalProvider(user)
      ? ["local"]
      : [];

  return {
    id: user._id,
    email: user.email,
    emailVerified: Boolean(user.emailVerified),
    authProviders: providers,
    hasPassword: providers.includes("local"),
    googleLinked: providers.includes("google"),
    role: user.role,
    status: user.status,
    profileId: user.profileId,
    roleProfile: user.roleProfile,
    createdAt: user.createdAt,
  };
}

async function getProfile(user) {
  let profile = null;

  if (user.role === "guide") {
    profile = await GuideProfile.findOne({ user: user._id }).select(
      "+rejectionReason",
    );
  }

  if (user.role === "tourist") {
    profile = await TouristProfile.findOne({ user: user._id });
  }

  if (profile || !["guide", "tourist"].includes(user.role)) return profile;

  const ProfileModel = user.role === "guide" ? GuideProfile : TouristProfile;
  profile = await ProfileModel.create({
    user: user._id,
    fullName: normalizeEmail(user.email).split("@")[0] || "Nefru member",
  });
  user.profileId = profile._id;
  user.roleProfile = user.role === "guide" ? "GuideProfile" : "TouristProfile";
  await user.save({ validateBeforeSave: false });

  return profile;
}

async function createAccount({
  fullName,
  email,
  role,
  password,
  googleSub,
  avatar = "",
  preferredLanguage = "en",
  emailVerified = false,
  authProviders = ["local"],
}) {
  const roleProfile = role === "tourist" ? "TouristProfile" : "GuideProfile";
  const ProfileModel = role === "tourist" ? TouristProfile : GuideProfile;

  let user = null;
  let profile = null;

  try {
    user = await User.create({
      email: email.toLowerCase(),
      password,
      role,
      roleProfile,
      googleSub,
      emailVerified,
      authProviders,
    });

    profile = await ProfileModel.create({
      user: user._id,
      fullName,
      ...(avatar ? { avatar } : {}),
      preferredLanguage,
    });

    user.profileId = profile._id;
    await user.save();

    return { user, profile };
  } catch (error) {
    if (profile) await profile.deleteOne().catch(() => {});
    if (user) await user.deleteOne().catch(() => {});
    throw error;
  }
}

function hasMeaningfulValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "number") return value > 0;
  return value !== undefined && value !== null && value !== "";
}

async function mergeRoleProfiles(targetUser, sourceUser, googleProfile) {
  const ProfileModel =
    targetUser.role === "guide" ? GuideProfile : TouristProfile;
  const targetProfile = await ProfileModel.findOne({ user: targetUser._id }).select(
    targetUser.role === "guide" ? "+rejectionReason" : "",
  );
  const resolvedSourceProfile = await ProfileModel.findOne({
    user: sourceUser._id,
  }).select(targetUser.role === "guide" ? "+rejectionReason" : "");

  if (!targetProfile) return null;

  const mergeableFields =
    targetUser.role === "guide"
      ? [
          "fullName",
          "avatar",
          "headline",
          "location",
          "phoneNumber",
          "gender",
          "nationality",
          "dateOfBirth",
          "preferredLanguage",
          "about",
          "yearsExperience",
          "languages",
          "specialties",
          "gallery",
        ]
      : [
          "fullName",
          "avatar",
          "phoneNumber",
          "gender",
          "nationality",
          "dateOfBirth",
          "preferredLanguage",
        ];

  for (const field of mergeableFields) {
    if (
      !hasMeaningfulValue(targetProfile[field]) &&
      hasMeaningfulValue(resolvedSourceProfile?.[field])
    ) {
      targetProfile[field] = resolvedSourceProfile[field];
    }
  }

  if (!hasMeaningfulValue(targetProfile.avatar) && googleProfile.avatar) {
    targetProfile.avatar = googleProfile.avatar;
  }

  if (
    !hasMeaningfulValue(targetProfile.preferredLanguage) &&
    googleProfile.preferredLanguage
  ) {
    targetProfile.preferredLanguage = googleProfile.preferredLanguage;
  }

  if (targetUser.role === "guide" && resolvedSourceProfile) {
    const statusRank = { draft: 0, rejected: 1, pending: 2, approved: 3 };
    if (
      (statusRank[resolvedSourceProfile.verificationStatus] ?? 0) >
      (statusRank[targetProfile.verificationStatus] ?? 0)
    ) {
      targetProfile.verificationStatus = resolvedSourceProfile.verificationStatus;
      targetProfile.rejectionReason = resolvedSourceProfile.rejectionReason || "";
    }

    const [targetVerification, sourceVerification] = await Promise.all([
      GuideVerification.findOne({ guideProfile: targetProfile._id }).select(
        "+documents +documents.storageKey +requestedChanges +reviewHistory",
      ),
      GuideVerification.findOne({ guideProfile: resolvedSourceProfile._id }).select(
        "+documents +documents.storageKey +requestedChanges +reviewHistory",
      ),
    ]);

    if (sourceVerification && !targetVerification) {
      sourceVerification.guideProfile = targetProfile._id;
      await sourceVerification.save();
    } else if (sourceVerification && targetVerification) {
      const existingTypes = new Set(
        targetVerification.documents.map((document) => document.documentType),
      );
      for (const document of sourceVerification.documents) {
        if (!existingTypes.has(document.documentType)) {
          targetVerification.documents.push(document.toObject());
        }
      }
      targetVerification.requestedChanges.push(
        ...sourceVerification.requestedChanges.map((item) => item.toObject()),
      );
      targetVerification.reviewHistory.push(
        ...sourceVerification.reviewHistory.map((item) => item.toObject()),
      );
      targetVerification.submittedAt =
        sourceVerification.submittedAt || targetVerification.submittedAt;
      targetVerification.reviewedAt =
        sourceVerification.reviewedAt || targetVerification.reviewedAt;
      targetVerification.reviewedBy =
        sourceVerification.reviewedBy || targetVerification.reviewedBy;
      await targetVerification.save();
    }
  }

  await targetProfile.save();
  return targetProfile;
}

async function mergeGoogleIdentity(targetUser, sourceUser, googleProfile) {
  if (sourceUser && String(sourceUser._id) !== String(targetUser._id)) {
    if (sourceUser.role !== targetUser.role) {
      const error = new Error(
        "The two accounts use different roles. Contact support before merging them.",
      );
      error.statusCode = 409;
      error.code = "ACCOUNT_ROLE_CONFLICT";
      throw error;
    }

    sourceUser.googleSub = undefined;
    sourceUser.authProviders = (sourceUser.authProviders || []).filter(
      (provider) => provider !== "google",
    );
    sourceUser.status = "deactivated";
    sourceUser.mergedInto = targetUser._id;
    sourceUser.mergedAt = new Date();
    await sourceUser.save({ validateBeforeSave: false });
  }

  targetUser.googleSub = googleProfile.googleSub;
  targetUser.emailVerified = true;
  const targetProviders = targetUser.authProviders?.length
    ? targetUser.authProviders
    : hasLocalProvider(targetUser)
      ? ["local"]
      : [];
  targetUser.authProviders = Array.from(
    new Set([...targetProviders, "google"]),
  );
  await targetUser.save({ validateBeforeSave: false });

  const profile = sourceUser
    ? await mergeRoleProfiles(targetUser, sourceUser, googleProfile)
    : await getProfile(targetUser);

  if (profile) {
    let changed = false;
    if (!profile.avatar && googleProfile.avatar) {
      profile.avatar = googleProfile.avatar;
      changed = true;
    }
    if (!profile.preferredLanguage && googleProfile.preferredLanguage) {
      profile.preferredLanguage = googleProfile.preferredLanguage;
      changed = true;
    }
    if (changed) await profile.save();
  }

  return profile;
}

function sendAuthenticatedResponse(res, user, profile, rememberMe, message) {
  const token = generateToken(user);
  setAuthCookie(res, token, rememberMe);

  return res.status(200).json({
    success: true,
    message,
    data: {
      user: serializeUser(user),
      profile,
    },
    // Kept temporarily for API clients that still use Bearer auth.
    // The Nefru frontend no longer persists this token in localStorage.
    meta: { token },
  });
}

async function sendVerificationEmail(user) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const previousToken = user.emailVerificationToken;
  const previousExpiry = user.emailVerificationExpires;
  user.emailVerificationToken = hashToken(rawToken);
  user.emailVerificationExpires = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${env.frontendUrl}/auth/verify-email?token=${encodeURIComponent(rawToken)}`;
  const email = buildVerificationEmail({ verifyUrl });

  try {
    await sendEmail({ email: user.email, ...email });
  } catch (error) {
    // Keep any previously issued link valid when SMTP is temporarily down.
    user.emailVerificationToken = previousToken;
    user.emailVerificationExpires = previousExpiry;
    await user.save({ validateBeforeSave: false }).catch(() => {});
    throw error;
  }
}

async function sendWelcomeEmailSafely(user, profile) {
  try {
    const email = buildWelcomeEmail({
      fullName: profile?.fullName || "",
      role: user.role,
      loginUrl: `${env.frontendUrl}/auth/login`,
    });
    await sendEmail({ email: user.email, ...email });
  } catch (error) {
    console.error("Welcome email could not be sent:", error.message);
  }
}

async function sendSecurityEmailSafely(user, subject, message) {
  try {
    await sendEmail({ email: user.email, subject, message });
  } catch (error) {
    console.error("Security email could not be sent:", error.message);
  }
}

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await findUserByCanonicalEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Account already exists",
      });
    }

    const { user, profile } = await createAccount({
      fullName,
      email,
      password,
      role,
      // TEMPORARY DEVELOPMENT BYPASS:
      // Skip email verification so new local accounts can be used immediately.
      // Production always creates them as unverified and sends the normal email.
      emailVerified: env.devAuthBypass,
      authProviders: ["local"],
    });

    if (env.devAuthBypass) {
      return sendAuthenticatedResponse(
        res,
        user,
        profile,
        false,
        "Account created and signed in (development auth bypass)",
      );
    }

    let emailSent = true;
    try {
      await sendVerificationEmail(user);
    } catch (error) {
      emailSent = false;
      console.error("Verification email could not be sent:", error.message);
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Account created. Check your email to verify your account."
        : "Account created, but the verification email could not be sent. You can resend it from the next screen.",
      data: {
        user: serializeUser(user),
        profile,
        requiresEmailVerification: true,
        emailSent,
      },
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({
      emailVerificationToken: hashToken(token),
      emailVerificationExpires: { $gt: Date.now() },
    }).select("+emailVerificationToken +emailVerificationExpires +tokenVersion");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This verification link is invalid or has expired",
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const profile = await getProfile(user);
    await sendWelcomeEmailSafely(user, profile);

    return sendAuthenticatedResponse(
      res,
      user,
      profile,
      false,
      "Email verified successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByCanonicalEmail(email, { requireLocal: true });

    if (
      user &&
      !user.emailVerified &&
      hasLocalProvider(user) &&
      user.status === "active"
    ) {
      try {
        await sendVerificationEmail(user);
      } catch (error) {
        console.error("Verification email could not be resent:", error.message);
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "If an unverified account exists, a new link has been sent. Check your Inbox and Spam/Junk folders.",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    const normalizedEmail = normalizeEmail(email);
    const candidates = await User.find({
      email: {
        $regex: new RegExp(
          `^\\s*${escapeRegExp(normalizedEmail)}\\s*$`,
          "i",
        ),
      },
      role: { $in: USER_ROLES },
      status: { $ne: "deactivated" },
    }).select("+password +tokenVersion +emailVerificationToken");
    let user = null;

    for (const candidate of candidates) {
      if (await candidate.comparePassword(password)) {
        user = candidate;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.authProviders?.length) {
      user.authProviders = ["local"];
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Unable to login, try later",
      });
    }

    if (
      !env.devAuthBypass &&
      !user.emailVerified &&
      hasLocalProvider(user) &&
      user.emailVerificationToken
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in. Check your Inbox and Spam/Junk folders for the verification link.",
        error: { code: "EMAIL_NOT_VERIFIED" },
      });
    }

    // Backward-compatible migration for accounts created before email
    // verification was introduced. New unverified accounts always have a
    // verification token, so only legacy accounts reach this branch.
    if (!user.emailVerified && !user.emailVerificationToken) {
      user.emailVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    const profile = await getProfile(user);
    return sendAuthenticatedResponse(
      res,
      user,
      profile,
      rememberMe,
      "Logged in successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const googleAuth = async (req, res, next) => {
  try {
    const { credential, role, rememberMe = false } = req.body;
    const payload = await verifyGoogleIdToken(credential);
    const googleProfile = getGoogleProfile(payload);
    const { googleSub, email, fullName, avatar, preferredLanguage } =
      googleProfile;

    let user = await User.findOne({ googleSub }).select(
      "+password +googleSub +tokenVersion +mergedInto +mergedAt",
    );

    if (user) {
      if (user.status !== "active") {
        return res.status(403).json({
          success: false,
          message: "Unable to login, try later",
        });
      }

      const duplicateLocalAccount = await findUserByCanonicalEmail(email, {
        excludeUserId: user._id,
        requireLocal: true,
      });

      if (duplicateLocalAccount && hasLocalProvider(duplicateLocalAccount)) {
        const linkingToken = createTemporaryAuthToken({
          purpose: "google_link",
          userId: String(duplicateLocalAccount._id),
          sourceUserId: String(user._id),
          email,
          googleSub,
          fullName,
          avatar,
          preferredLanguage,
        });

        return res.status(200).json({
          success: true,
          data: {
            requiresAccountLink: true,
            linkingToken,
            email,
            existingRole: duplicateLocalAccount.role,
            googleRole: user.role,
          },
          message:
            "A password account with this email already exists. Confirm its password to merge the duplicate accounts.",
        });
      }

      const profile = await mergeGoogleIdentity(user, null, googleProfile);
      return sendAuthenticatedResponse(
        res,
        user,
        profile,
        rememberMe,
        "Signed in with Google",
      );
    }

    user = await findUserByCanonicalEmail(email);

    if (user) {
      if (!hasLocalProvider(user)) {
        const profile = await mergeGoogleIdentity(user, null, googleProfile);
        return sendAuthenticatedResponse(
          res,
          user,
          profile,
          rememberMe,
          "Signed in with Google",
        );
      }

      const linkingToken = createTemporaryAuthToken({
        purpose: "google_link",
        userId: String(user._id),
        email,
        googleSub,
        fullName,
        avatar,
        preferredLanguage,
      });

      return res.status(200).json({
        success: true,
        data: {
          requiresAccountLink: true,
          linkingToken,
          email,
        },
        message: "Confirm your existing Nefru password to link Google securely.",
      });
    }

    if (!role || !REGISTER_ROLES.includes(role)) {
      const onboardingToken = createTemporaryAuthToken({
        purpose: "google_onboarding",
        email,
        googleSub,
        fullName,
        avatar,
        preferredLanguage,
      });

      return res.status(200).json({
        success: true,
        data: {
          requiresOnboarding: true,
          onboardingToken,
          googleProfile: { email, fullName, avatar, preferredLanguage },
        },
        message: "Choose how you want to use Nefru to finish sign up.",
      });
    }

    const created = await createAccount({
      fullName,
      email,
      role,
      googleSub,
      avatar,
      preferredLanguage,
      emailVerified: true,
      authProviders: ["google"],
    });

    await sendWelcomeEmailSafely(created.user, created.profile);
    return sendAuthenticatedResponse(
      res,
      created.user,
      created.profile,
      rememberMe,
      "Google account created successfully",
    );
  } catch (error) {
    res.status(error.statusCode || 401);
    next(error);
  }
};

export const completeGoogleSignup = async (req, res, next) => {
  try {
    const { onboardingToken, role, rememberMe = false } = req.body;
    const payload = verifyTemporaryAuthToken(
      onboardingToken,
      "google_onboarding",
    );

    const duplicate =
      (await User.findOne({ googleSub: payload.googleSub })) ||
      (await findUserByCanonicalEmail(payload.email));

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "An account already exists. Please sign in again.",
      });
    }

    const created = await createAccount({
      fullName: payload.fullName,
      email: payload.email,
      role,
      googleSub: payload.googleSub,
      avatar: payload.avatar || "",
      preferredLanguage: payload.preferredLanguage || "en",
      emailVerified: true,
      authProviders: ["google"],
    });

    await sendWelcomeEmailSafely(created.user, created.profile);
    return sendAuthenticatedResponse(
      res,
      created.user,
      created.profile,
      rememberMe,
      "Google account created successfully",
    );
  } catch (error) {
    res.status(400);
    next(error);
  }
};

export const linkGoogleAccount = async (req, res, next) => {
  try {
    const { linkingToken, password, rememberMe = false } = req.body;
    const payload = verifyTemporaryAuthToken(linkingToken, "google_link");

    const user = await User.findById(payload.userId).select(
      "+password +googleSub +tokenVersion",
    );

    if (
      !user ||
      normalizeEmail(user.email) !== normalizeEmail(payload.email) ||
      user.status !== "active"
    ) {
      return res.status(400).json({
        success: false,
        message: "Unable to link this Google account",
      });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const googleOwner = await User.findOne({
      googleSub: payload.googleSub,
      _id: { $ne: user._id },
    }).select("+password +googleSub +tokenVersion +mergedInto +mergedAt");

    if (
      googleOwner &&
      (!payload.sourceUserId ||
        String(googleOwner._id) !== String(payload.sourceUserId))
    ) {
      return res.status(409).json({
        success: false,
        message: "This Google account is already linked to another Nefru account",
      });
    }

    const sourceUser = googleOwner;

    if (sourceUser && sourceUser.googleSub !== payload.googleSub) {
      return res.status(409).json({
        success: false,
        message: "The Google account link changed. Please try again.",
      });
    }

    const profile = await mergeGoogleIdentity(user, sourceUser, {
      email: payload.email,
      googleSub: payload.googleSub,
      fullName: payload.fullName,
      avatar: payload.avatar || "",
      preferredLanguage: payload.preferredLanguage || "en",
    });
    await sendSecurityEmailSafely(
      user,
      "Google sign-in linked to your Nefru account",
      "Google sign-in was linked to your Nefru account. If this was not you, change your password and contact support.",
    );

    return sendAuthenticatedResponse(
      res,
      user,
      profile,
      rememberMe,
      "Google account linked successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const connectGoogleAccount = async (req, res, next) => {
  try {
    const payload = await verifyGoogleIdToken(req.body.credential);
    const googleProfile = getGoogleProfile(payload);
    const user = await User.findById(req.user._id).select(
      "+password +googleSub +tokenVersion +mergedInto +mergedAt",
    );

    if (!user || user.status !== "active") {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (normalizeEmail(user.email) !== googleProfile.email) {
      return res.status(409).json({
        success: false,
        message: "Use the Google account with the same email as your Nefru account.",
        error: { code: "GOOGLE_EMAIL_MISMATCH" },
      });
    }

    const googleOwner = await User.findOne({
      googleSub: googleProfile.googleSub,
      _id: { $ne: user._id },
    }).select("+password +googleSub +tokenVersion +mergedInto +mergedAt");

    const profile = await mergeGoogleIdentity(user, googleOwner, googleProfile);
    await sendSecurityEmailSafely(
      user,
      "Google sign-in linked to your Nefru account",
      "Google sign-in was linked to your Nefru account. If this was not you, change your password and contact support.",
    );

    return sendAuthenticatedResponse(
      res,
      user,
      profile,
      true,
      googleOwner
        ? "Duplicate accounts merged and Google linked successfully"
        : "Google account linked successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const disconnectGoogleAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "+password +googleSub +tokenVersion",
    );

    if (!user || user.status !== "active") {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (!user.googleSub || !user.authProviders?.includes("google")) {
      const profile = await getProfile(user);
      return sendAuthenticatedResponse(
        res,
        user,
        profile,
        true,
        "Google is already disconnected",
      );
    }

    if (!hasLocalProvider(user) || !user.password) {
      return res.status(409).json({
        success: false,
        message: "Set a Nefru password before disconnecting Google.",
        error: { code: "PASSWORD_REQUIRED_BEFORE_DISCONNECT" },
      });
    }

    user.googleSub = undefined;
    user.authProviders = user.authProviders.filter(
      (provider) => provider !== "google",
    );
    user.tokenVersion = Number(user.tokenVersion || 0) + 1;
    await user.save({ validateBeforeSave: false });

    const profile = await getProfile(user);
    await sendSecurityEmailSafely(
      user,
      "Google sign-in disconnected from Nefru",
      "Google sign-in was disconnected from your Nefru account. You can still sign in with your Nefru password.",
    );

    return sendAuthenticatedResponse(
      res,
      user,
      profile,
      true,
      "Google account disconnected successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const genericMessage =
      "If this email has a password-based Nefru account, a reset link has been sent.";

    const user = await findUserByCanonicalEmail(email, { requireLocal: true });

    if (!user || !hasLocalProvider(user)) {
      return res.status(200).json({ success: true, message: genericMessage });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${env.frontendUrl}/auth/reset-password?token=${encodeURIComponent(resetToken)}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset your Nefru password",
        message: `Reset your Nefru password using this link: ${resetUrl}. The link is valid for 10 minutes.`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f2d4e">
            <h2>Reset your password</h2>
            <p>We received a request to reset your Nefru password.</p>
            <p><a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#0f2d4e;color:#fff;text-decoration:none;border-radius:8px">Reset password</a></p>
            <p>This link is valid for 10 minutes. If you did not request a reset, ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error("Password reset email could not be sent:", emailError.message);
    }

    return res.status(200).json({ success: true, message: genericMessage });
  } catch (error) {
    next(error);
  }
};

export const verifyResetToken = async (req, res, next) => {
  try {
    const user = await User.findOne({
      passwordResetToken: hashToken(req.body.token),
      passwordResetExpires: { $gt: Date.now() },
    }).select("_id");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This reset link is invalid or has expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reset link verified",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires +tokenVersion");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    user.password = password;
    user.authProviders = Array.from(
      new Set([...(user.authProviders || []), "local"]),
    );
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.tokenVersion = Number(user.tokenVersion || 0) + 1;
    await user.save();

    clearAuthCookie(res);
    await sendSecurityEmailSafely(
      user,
      "Your Nefru password was changed",
      "Your Nefru password was reset successfully. Existing sessions have been invalidated. If this was not you, contact support immediately.",
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in again.",
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select(
      "+password +tokenVersion",
    );

    if (!user || user.status !== "active") {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const isSettingFirstPassword = !hasLocalProvider(user) || !user.password;

    if (!isSettingFirstPassword && !currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required",
      });
    }

    if (!isSettingFirstPassword && !(await user.comparePassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    if (!isSettingFirstPassword && (await user.comparePassword(newPassword))) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    user.password = newPassword;
    user.authProviders = Array.from(
      new Set([...(user.authProviders || []), "local"]),
    );
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.tokenVersion = Number(user.tokenVersion || 0) + 1;
    await user.save();

    const token = generateToken(user);
    setAuthCookie(res, token, false);

    await sendSecurityEmailSafely(
      user,
      "Your Nefru password was changed",
      "Your Nefru password was changed successfully. Other sessions have been invalidated.",
    );

    const profile = await getProfile(user);

    return res.status(200).json({
      success: true,
      message: isSettingFirstPassword
        ? "Password created successfully"
        : "Password changed successfully",
      data: {
        user: serializeUser(user),
        profile,
      },
      meta: { token },
    });
  } catch (error) {
    next(error);
  }
};
