import express from "express";
import {registerUser, loginUser, forgotPassword, resetPassword, changePassword} from "../controllers/Auth/authUser.controller.js";
import { validate } from "../middlewares/validate.js";
import {registerUserSchema, loginUserSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema} from "../controllers/validation/userValidation.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), loginUser);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.patch("/change-password", protect, validate(changePasswordSchema), changePassword);

export default router;