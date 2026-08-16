import { User, USER_ROLES, REGISTER_ROLES } from "../../models/user.model.js";
import { generateToken } from "../../utils/generateToken.js";
import crypto from "crypto";
import { env } from "../../config/env.js";

// import Auth from '../../models/auth.model.js'

import { TouristProfile } from "../../models/tourist.model.js";
import { GuideProfile } from "../../models/guide.model.js";

// auth is only for authenticating a user no matter guide or tourist
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        message: "Account already used",
        data: existingUser
      });
    }

    const user = await User.create({ email, password })
    return res.status(200).json({
      message: "Account created Successfuly",
      data: user
    })

  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Account creation failed, try later"
    })
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

    if (!user.status) {
      return res.status(403).json({
        message: "Unable to login, try later"
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json(
      {
        "success": true,
        "message": "Operation completed successfully",
        "data": { user },
        "meta": { token }
      });

  } catch (error) {
    return res.status(500).json(
      {
        "success": false,
        "message": "Login failed",
        "error": {
          "code": "LOGIN_ERROR",
          "details": []
        }
      })
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

    if (env.nodeEnv === "development") {
      return res.status(200).json({
        success: true,
        message: "If this email exists, a reset token has been generated",
        resetToken,
      });
    }

    res.status(200).json({
      success: true,
      message: "If this email exists, a reset token has been generated",
    });

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

    if (!user || !user.isActive) {
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
