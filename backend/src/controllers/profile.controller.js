import { User } from "../models/user.model.js";
import { TouristProfile } from "../models/tourist.model.js";
import { GuideProfile } from "../models/guide.model.js";

const getProfileModelByRole = (role) => {
  if (role === "tourist") return TouristProfile;
  if (role === "guide") return GuideProfile;
  return null;
};

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const ProfileModel = getProfileModelByRole(user.role);

    let profile = null;

    if (ProfileModel) {
      profile = await ProfileModel.findOne({ user: user._id });
    }

    return res.status(200).json({
      success: true,
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

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const allowedUserFields = ["fullName", "avatar"];

    const userUpdateData = {};

    allowedUserFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        userUpdateData[field] = req.body[field];
      }
    });

    let updatedUser = user;

    if (Object.keys(userUpdateData).length > 0) {
      updatedUser = await User.findByIdAndUpdate(
        user._id,
        userUpdateData,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");
    }

    const ProfileModel = getProfileModelByRole(user.role);

    if (!ProfileModel) {
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: {
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            verificationStatus: updatedUser.verificationStatus,
            isActive: updatedUser.isActive,
            createdAt: updatedUser.createdAt,
          },
          profile: null,
        },
      });
    }

    const allowedProfileFields = [
      "phoneNumber",
      "gender",
      "nationality",
      "dateOfBirth",
      "preferredLanguage",
    ];

    const profileUpdateData = {};

    allowedProfileFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profileUpdateData[field] = req.body[field];
      }
    });

    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { user: user._id },
      profileUpdateData,
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          verificationStatus: updatedUser.verificationStatus,
          isActive: updatedUser.isActive,
          createdAt: updatedUser.createdAt,
        },
        profile: updatedProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};