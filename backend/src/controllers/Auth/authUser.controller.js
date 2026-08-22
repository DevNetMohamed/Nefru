import { User, USER_ROLES } from "../../models/user.model.js";
import { generateToken } from "../../utils/generateToken.js";
import crypto from "crypto";
import { env } from "../../config/env.js";
import { sendEmail } from "../../utils/sendEmail.js";
// import Auth from '../../models/auth.model.js'

import { TouristProfile } from "../../models/tourist.model.js";
import { GuideProfile } from "../../models/guide.model.js";

// auth is only for authenticating a user no matter guide or tourist
export const registerUser = async (req, res, next) => {
  let createdUser = null;
  let createdProfile = null;

  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Account already exists",
      });
    }

    const roleProfile = role === "tourist" ? "TouristProfile" : "GuideProfile";
    const ProfileModel = role === "tourist" ? TouristProfile : GuideProfile;

    createdUser = await User.create({ email, password, role, roleProfile });
    createdProfile = await ProfileModel.create({
      user: createdUser._id,
      fullName,
    });

    createdUser.profileId = createdProfile._id;
    await createdUser.save();

    const token = generateToken(createdUser._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: {
          id: createdUser._id,
          email: createdUser.email,
          role: createdUser.role,
          status: createdUser.status,
          profileId: createdUser.profileId,
          roleProfile: createdUser.roleProfile,
          createdAt: createdUser.createdAt,
        },
        profile: createdProfile,
      },
      meta: { token },
    });
  } catch (error) {
    if (createdProfile) {
      await createdProfile.deleteOne().catch(() => {});
    }

    if (createdUser) {
      await createdUser.deleteOne().catch(() => {});
    }

    res.status(400);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      role: { $in: USER_ROLES },
    }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Unable to login, try later",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);
    let profile = null;

    if (user.role === "guide") {
      profile = await GuideProfile.findOne({ user: user._id }).select(
        "+rejectionReason",
      );
    } else if (user.role === "tourist") {
      profile = await TouristProfile.findOne({ user: user._id });
    }

    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
          profileId: user.profileId,
          roleProfile: user.roleProfile,
          createdAt: user.createdAt,
        },
        profile,
      },
      meta: { token },
    });
  } catch (error) {
    const statusCode =
      res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    return res.status(statusCode).json({
      success: false,
      message: "Login failed",
      error: {
        code: "LOGIN_ERROR",
        details: [],
      },
    });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Security: don't reveal if email exists or not
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If this email exists, a reset token has been generated",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Send email with reset token
    const message = `You requested a password reset. Use the following token to reset your password: ${resetToken}. \n This token is valid for 10 minutes. \n Enter the token in the reset password form to proceed. \n If you did not request this, please ignore this email. \n Thanks for helping us keep your account secure. \n The Nefru Team`;
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    // Security: don't reveal if email exists or not
    if (env.nodeEnv === "development") {
      return res.status(200).json({
        success: true,
        message: "If this email exists, a reset token has been generated",
        resetToken,
      });
    }

    if (env.nodeEnv === "production") {
      return res.status(200).json({
        success: true,
        message:
          "If this email exists, a reset token has been sent to the registered email address",
      });
    }

    console.log("NODE_ENV:", env.nodeEnv);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired reset token");
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user || user.status !== "active") {
      res.status(401);
      throw new Error("Not authorized");
    }

    const isCurrentPasswordCorrect =
      await user.comparePassword(currentPassword);

    if (!isCurrentPasswordCorrect) {
      res.status(400);
      throw new Error("Unable to change password");
    }

    const isSamePassword = await user.comparePassword(newPassword);

    if (isSamePassword) {
      res.status(400);
      throw new Error("Unable to change password");
    }

    user.password = newPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
