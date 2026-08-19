import { Router } from "express";
import {
  getGuideById,
  getMyGuideProfile,
  updateMyGuideProfile,
} from "../controllers/guide.controller.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  updateGuideProfileSchema,
} from "../controllers/validation/guideValidation.js";

const guideRouter = Router();

/**
 * @route GET /api/guides/profile/me
 * @desc Get current user's guide profile
 * @access Private (GuideProfile only)
 */
guideRouter.get(
  "/profile/me",
  protect,
  authorizeRoles("guide"),
  getMyGuideProfile,
);

/**
 * @route PUT /api/guides/profile/me
 * @desc Update current user's guide profile
 * @access Private (GuideProfile only)
 */
guideRouter.put(
  "/profile/me",
  protect,
  authorizeRoles("guide"),
  validate(updateGuideProfileSchema),
  updateMyGuideProfile,
);

/**
 * @route GET /api/guides/:id
 * @desc Get a guide's public profile by ID
 * @access Public
 */
guideRouter.get("/:id", getGuideById);

export default guideRouter;
