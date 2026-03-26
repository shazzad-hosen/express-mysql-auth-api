import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
  logoutAllUser,
  getActiveSessions,
  revokeSpecificSession,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../services/auth.service.js";

import { ENV } from "../config/env.js";
import { parseToMs } from "../utils/parseToMs.js";

export const registerUserController = async (req, res) => {
  const result = await registerUser(req.body, {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV,
    sameSite: "strict",
    maxAge: parseToMs(ENV.JWT_REFRESH_EXPIRY),
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      ...result,
    },
  });
};

export const loginUserController = async (req, res) => {
  const result = await loginUser(req.body, {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV,
    sameSite: "strict",
    maxAge: parseToMs(ENV.JWT_REFRESH_EXPIRY),
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

export const refreshUserTokenController = async (req, res) => {
  const tokens = await refreshUserToken(req.userId, req.refreshToken, {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV,
    sameSite: "strict",
    maxAge: parseToMs(ENV.JWT_REFRESH_EXPIRY),
  });

  res.status(200).json({
    success: true,
    accessToken: tokens.accessToken,
  });
};

export const logoutUserController = async (req, res) => {
  const token = req.cookies?.refreshToken;
  const result = await logoutUser(token);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const logoutAllUserController = async (req, res) => {
  const data = await logoutAllUser(req.userId);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    ...data,
  });
};

export const getActiveSessionsController = async (req, res) => {
  const sessions = await getActiveSessions(req.userId);

  res.status(200).json({
    success: true,
    total: sessions["sessions"].length,
    data: sessions,
  });
};

export const revokeSpecificSessionController = async (req, res) => {
  const session = await revokeSpecificSession(req.userId, req.params.id);

  res.status(200).json({
    success: true,
    ...session,
  });
};

export const changePasswordController = async (req, res) => {
  const result = await changePassword(req.userId, req.body);

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const forgotPasswordController = async (req, res) => {
  const result = await forgotPassword(req.body.email);

  res.status(200).json({
    success: true,
    ...result,
  });
};

export const resetPasswordController = async (req, res) => {
  const { token, newPassword } = req.body;
  
  const result = await resetPassword(token, newPassword);

  res.status(200).json({
    success: true,
    ...result,
  });
};
