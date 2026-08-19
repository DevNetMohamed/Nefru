import { GuideProfile } from "../models/guide.model.js";
import { TouristProfile } from "../models/tourist.model.js";
import { User } from "../models/user.model.js";

function serializeUser(user) {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
    profileId: user.profileId,
    roleProfile: user.roleProfile,
    createdAt: user.createdAt,
  };
}

async function findProfile(user) {
  if (user.role === "guide") {
    return GuideProfile.findOne({ user: user._id }).select("+rejectionReason");
  }

  if (user.role === "tourist") {
    return TouristProfile.findOne({ user: user._id });
  }

  return null;
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
