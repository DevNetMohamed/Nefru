import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getOwnGuideProfile,
  getPublicGuideProfile,
  updateOwnGuideProfile,
} from "../services/guide.service.js";

export const getGuideById = asyncHandler(async (req, res) => {
  const guide = await getPublicGuideProfile(req.params.id);

  if (!guide) {
    res.status(404);
    throw new Error("GuideProfile not found");
  }

  res.status(200).json({
    success: true,
    data: { guide },
  });
});

export const getMyGuideProfile = asyncHandler(async (req, res) => {
  const guide = await getOwnGuideProfile(req.user._id);

  if (!guide) {
    res.status(404);
    throw new Error("GuideProfile profile not found");
  }

  res.status(200).json({
    success: true,
    data: { guide },
  });
});

export const updateMyGuideProfile = asyncHandler(async (req, res) => {
  const guide = await updateOwnGuideProfile(req.user._id, req.body);

  if (!guide) {
    res.status(404);
    throw new Error("GuideProfile profile not found");
  }

  res.status(200).json({
    success: true,
    message: "GuideProfile profile updated successfully",
    data: { guide },
  });
});
