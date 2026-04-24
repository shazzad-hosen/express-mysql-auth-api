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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register user
 *     description: Creates a new user and sends email verification OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 */
router.post("/register", authLimiter, asyncHandler(registerUserController));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     description: Login only works if email is verified
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 */
router.post("/login", authLimiter, asyncHandler(loginUserController));

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New tokens issued
 *       403:
 *         description: Token reuse detected
 */
router.post(
  "/refresh",
  refreshLimiter,
  verifyRefreshToken,
  asyncHandler(refreshUserTokenController),
);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout current session
 *     description: Deletes current refresh token (current device logout)
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", globalLimiter, asyncHandler(logoutUserController));

router.post(
  "/logout-all",
  globalLimiter,
  verifyAccessToken,
  requireVerified,
  asyncHandler(logoutAllUserController),
);

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get all active sessions
 *     description: Returns all active sessions (devices) for the logged-in user
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active sessions
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               sessions:
 *                 - id: 1
 *                   user_agent: "Chrome on Linux"
 *                   ip: "192.168.1.1"
 *                   created_at: "2026-04-24T12:00:00Z"
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Send password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent if email exists
 */
router.post(
  "/forgot-password",
  otpLimiter,
  asyncHandler(forgotPasswordController),
);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post(
  "/reset-password",
  globalLimiter,
  asyncHandler(resetPasswordController),
);

/**
 * @swagger
 * /verify-email:
 *   post:
 *     summary: Verify email with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post(
  "/verify-email",
  otpLimiter,
  asyncHandler(verifyEmailOTPController),
);

/**
 * @swagger
 * /resend-verification:
 *   post:
 *     summary: Resend verification OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent if email exists
 */
router.post(
  "/resend-verification",
  otpLimiter,
  asyncHandler(resendVerificationController),
);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Revoke a session
 *     description: Logs out a specific device/session
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session revoked successfully
 *       404:
 *         description: Session not found
 */
router.delete(
  "/sessions/:id",
  globalLimiter,
  verifyAccessToken,
  requireVerified,
  asyncHandler(revokeSpecificSessionController),
);

export default router;
