import { Router } from "express";
import {
  getGuideById,
  getMyGuideProfile,
  updateMyGuideProfile,
} from "../controllers/guide.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const guideRouter = Router();

/**
 * @route GET /api/guides/:id
 * @desc Get a guide's public profile by ID
 * @access Public
 */
guideRouter.get("/:id", getGuideById);

/**
 * @route GET /api/guides/profile/me
 * @desc Get current user's guide profile
 * @access Private (Guide only)
 */
guideRouter.get("/profile/me", protect, getMyGuideProfile);

/**
 * @route PUT /api/guides/profile/me
 * @desc Update current user's guide profile
 * @access Private (Guide only)
 */
guideRouter.put("/profile/me", protect, updateMyGuideProfile);

export default guideRouter;
