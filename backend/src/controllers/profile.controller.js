import { GuideProfile } from "../models/guide.model.js";
import { TouristProfile } from "../models/tourist.model.js";
import { User } from "../models/user.model.js";

function serializeUser(user) {
  const providers = user.authProviders?.length ? user.authProviders : ["local"];

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

async function findProfile(user) {
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
    fullName: String(user.email || "Nefru member").split("@")[0],
  });
  user.profileId = profile._id;
  user.roleProfile = user.role === "guide" ? "GuideProfile" : "TouristProfile";
  await user.save({ validateBeforeSave: false });

  return profile;
}

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.status !== "active") {
      res.status(401);
      throw new Error("Not authorized");
    }

    const profile = await findProfile(user);

    return res.status(200).json({
      success: true,
      data: {
        user: serializeUser(user),
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadMyAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Choose an image to upload",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.status !== "active" || user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "This account does not have an editable profile",
      });
    }

    const ProfileModel =
      user.role === "guide" ? GuideProfile : TouristProfile;
    await findProfile(user);
    const profile = await ProfileModel.findOneAndUpdate(
      { user: user._id },
      { $set: { avatar: `/uploads/${req.file.filename}` } },
      { new: true, runValidators: true },
    ).select(user.role === "guide" ? "+rejectionReason" : "");

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      data: {
        user: serializeUser(user),
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.status !== "active") {
      res.status(401);
      throw new Error("Not authorized");
    }

    if (user.role === "guide") {
      return res.status(400).json({
        success: false,
        message: "Use /api/guides/profile/me to update a guide profile",
      });
    }

    if (user.role !== "tourist") {
      return res.status(403).json({
        success: false,
        message: "This account does not have an editable traveler profile",
      });
    }

    const allowedProfileFields = [
      "fullName",
      "avatar",
      "phoneNumber",
      "gender",
      "nationality",
      "dateOfBirth",
      "preferredLanguage",
    ];

    const profileUpdateData = {};

    for (const field of allowedProfileFields) {
      if (req.body[field] !== undefined) {
        profileUpdateData[field] = req.body[field];
      }
    }

    if (Object.keys(profileUpdateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one traveler profile field is required",
      });
    }

    const updatedProfile = await TouristProfile.findOneAndUpdate(
      { user: user._id },
      { $set: profileUpdateData },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: serializeUser(user),
        profile: updatedProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};
