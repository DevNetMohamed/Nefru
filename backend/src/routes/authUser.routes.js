import express from "express";

import {
  changePassword,
  completeGoogleSignup,
  connectGoogleAccount,
  disconnectGoogleAccount,
  forgotPassword,
  googleAuth,
  linkGoogleAccount,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
  verifyResetToken,
} from "../controllers/Auth/authUser.controller.js";
import {
  changePasswordSchema,
  completeGoogleSignupSchema,
  connectGoogleAccountSchema,
  emailOnlySchema,
  forgotPasswordSchema,
  googleAuthSchema,
  linkGoogleAccountSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  tokenOnlySchema,
} from "../controllers/validation/userValidation.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createRateLimiter } from "../utils/rateLimiter.js";

const router = express.Router();

const authLimiter = createRateLimiter({
  name: "auth",
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again later.",
});

const recoveryLimiter = createRateLimiter({
  name: "recovery",
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: "Too many recovery requests. Please try again later.",
});

router.post("/register", authLimiter, validate(registerUserSchema), registerUser);
router.post("/login", authLimiter, validate(loginUserSchema), loginUser);
router.post("/logout", logoutUser);

router.post("/google", authLimiter, validate(googleAuthSchema), googleAuth);
router.post(
  "/google/complete-signup",
  authLimiter,
  validate(completeGoogleSignupSchema),
  completeGoogleSignup,
);
router.post(
  "/google/link",
  authLimiter,
  validate(linkGoogleAccountSchema),
  linkGoogleAccount,
);
router.post(
  "/google/connect",
  protect,
  authLimiter,
  validate(connectGoogleAccountSchema),
  connectGoogleAccount,
);
router.delete(
  "/google/connect",
  protect,
  authLimiter,
  disconnectGoogleAccount,
);

router.post("/verify-email", recoveryLimiter, validate(tokenOnlySchema), verifyEmail);
router.post(
  "/resend-verification",
  recoveryLimiter,
  validate(emailOnlySchema),
  resendVerificationEmail,
);

router.post(
  "/forgot-password",
  recoveryLimiter,
  validate(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/reset-password/verify",
  recoveryLimiter,
  validate(tokenOnlySchema),
  verifyResetToken,
);
router.post(
  "/reset-password",
  recoveryLimiter,
  validate(resetPasswordSchema),
  resetPassword,
);
router.patch(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword,
);

export default router;
