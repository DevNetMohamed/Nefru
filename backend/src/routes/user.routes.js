import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getMe } from "../controllers/user.controller.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profile.controller.js";

const userRouter = Router();

userRouter.get("/profile/me", protect, getMyProfile);
userRouter.patch("/profile/me", protect, updateMyProfile);

userRouter.get("/me", protect, getMe);

export default userRouter;