import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../config/upload.js";
import { validate } from "../middlewares/validate.js";
import { updateTouristProfileSchema } from "../controllers/validation/userValidation.js";
import { getMe } from "../controllers/user.controller.js";
import {
  getMyProfile,
  uploadMyAvatar,
  updateMyProfile,
} from "../controllers/profile.controller.js";

const userRouter = Router();

userRouter.get("/profile/me", protect, getMyProfile);
userRouter.patch(
  "/profile/me",
  protect,
  validate(updateTouristProfileSchema),
  updateMyProfile,
);
userRouter.post(
  "/profile/avatar",
  protect,
  upload.single("avatar"),
  uploadMyAvatar,
);

userRouter.get("/me", protect, getMe);

export default userRouter;
