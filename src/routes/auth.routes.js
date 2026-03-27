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

const router = express.Router();

router.post("/register", asyncHandler(registerUserController));

router.post("/login", asyncHandler(loginUserController));

router.post(
  "/refresh",
  verifyRefreshToken,
  asyncHandler(refreshUserTokenController),
);

router.post("/logout", asyncHandler(logoutUserController));

router.post(
  "/logout-all",
  verifyAccessToken,
  requireVerified,
  asyncHandler(logoutAllUserController),
);

router.get(
  "/sessions",
  verifyAccessToken,
  requireVerified,
  asyncHandler(getActiveSessionsController),
);

router.post(
  "/change-password",
  verifyAccessToken,
  requireVerified,
  asyncHandler(changePasswordController),
);

router.post("/forgot-password", asyncHandler(forgotPasswordController));

router.post("/reset-password", asyncHandler(resetPasswordController));

router.post("/verify-email", asyncHandler(verifyEmailOTPController));

router.post("/resend-verification", asyncHandler(resendVerificationController));

router.delete(
  "/sessions/:id",
  verifyAccessToken,
  requireVerified,
  asyncHandler(revokeSpecificSessionController),
);

export default router;
