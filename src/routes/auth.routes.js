import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import verifyRefreshToken from "../middlewares/verifyRefreshToken.middleware.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.middleware.js";
import { requireVerified } from "../middlewares/requireVerified.js";

import {
  registerUserController,
  loginUserController,
  refreshUserTokenController,
  logoutUserController,
  logoutAllUserController,
  getActiveSessionsController,
  revokeSpecificSessionController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller.js";

import {
  verifyEmailOTPController,
  resendVerificationController,
} from "../controllers/emailVerification.controller.js";

import {
  authLimiter,
  otpLimiter,
  refreshLimiter,
  globalLimiter,
} from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, asyncHandler(registerUserController));

router.post("/login", authLimiter, asyncHandler(loginUserController));

router.post(
  "/refresh",
  refreshLimiter,
  verifyRefreshToken,
  asyncHandler(refreshUserTokenController),
);

router.post("/logout", globalLimiter, asyncHandler(logoutUserController));

router.post(
  "/logout-all",
  globalLimiter,
  verifyAccessToken,
  requireVerified,
  asyncHandler(logoutAllUserController),
);

router.get(
  "/sessions",
  globalLimiter,
  verifyAccessToken,
  requireVerified,
  asyncHandler(getActiveSessionsController),
);

router.post(
  "/change-password",
  globalLimiter,
  verifyAccessToken,
  requireVerified,
  asyncHandler(changePasswordController),
);

router.post(
  "/forgot-password",
  otpLimiter,
  asyncHandler(forgotPasswordController),
);

router.post(
  "/reset-password",
  globalLimiter,
  asyncHandler(resetPasswordController),
);

router.post(
  "/verify-email",
  otpLimiter,
  asyncHandler(verifyEmailOTPController),
);

router.post(
  "/resend-verification",
  otpLimiter,
  asyncHandler(resendVerificationController),
);

router.delete(
  "/sessions/:id",
  globalLimiter,
  verifyAccessToken,
  requireVerified,
  asyncHandler(revokeSpecificSessionController),
);

export default router;
