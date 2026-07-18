import { User, USER_ROLES, REGISTER_ROLES } from "../../models/user.model.js";
import { generateToken } from "../../utils/generateToken.js";
import crypto from "crypto";
import { env } from "../../config/env.js";
import { TouristProfile } from "../../models/tourist.model.js";
import { Guide } from "../../models/guide.model.js";

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!REGISTER_ROLES.includes(role)) {
      res.status(400);
      throw new Error("Invalid role");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("Unable to create account");
    }

    let user;

    try {
      user = await User.create({
        fullName,
        email,
        password,
        role,
        verificationStatus: role === "guide" ? "pending" : "approved",
        // Later with multer:
        // verificationDocument will be required here.
        // If uploaded successfully, verificationStatus remains "pending".
      });

      if (role === "tourist") {
        await TouristProfile.create({ user: user._id });
      }

      if (role === "guide") {
        await Guide.create({ user: user._id });
      }

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        token,
        data: {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            verificationStatus: user.verificationStatus,
            isActive: user.isActive,
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error) {
      if (user?._id) {
        await User.findByIdAndDelete(user._id);
      }
      return next(error);
    }
  } catch (error) {
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

    if (!user.isActive) {
      res.status(403);
      throw new Error("Unable to login");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          verificationStatus: user.verificationStatus,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
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
