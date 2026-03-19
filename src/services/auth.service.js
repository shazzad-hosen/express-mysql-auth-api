import { ENV } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { parseToMs } from "../utils/parseToMs.js";

import {
  createUser,
  findUserByEmail,
} from "../repositories/user.repository.js";

import {
  createRefreshToken,
  findRefreshTokenByHash,
  deleteRefreshTokenById,
  deleteRefreshTokenByHash,
  deleteRefreshTokenByUserId,
  findSessionsByUserId,
} from "../repositories/token.repository.js";

import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/generateTokens.js";

export const registerUser = async (data, meta) => {
  const { email, password } = data;
  const { userAgent, ip } = meta;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    email,
    passwordHash,
  });

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  const tokenHash = await hashToken(refreshToken);

  const expiresAt = new Date(Date.now() + parseToMs(ENV.JWT_REFRESH_EXPIRY));

  await createRefreshToken({
    userId: user.id,
    tokenHash,
    expiresAt,
    userAgent,
    ip,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (data, meta) => {
  const { email, password } = data;
  const { userAgent, ip } = meta;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password_hash);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  const tokenHash = await hashToken(refreshToken);

  const expiresAt = new Date(Date.now() + parseToMs(ENV.JWT_REFRESH_EXPIRY));

  await createRefreshToken({
    userId: user.id,
    tokenHash,
    expiresAt,
    userAgent,
    ip,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshUserToken = async (userId, existingRefreshToken, meta) => {
  const sessionData = await findRefreshTokenByHash(existingRefreshToken);

  if (!sessionData) {
    throw new ApiError(403, "Session not found");
  }

  const userData = {
    id: sessionData.user_id,
    role: sessionData.role || "user",
  };

  const newAccessToken = await generateAccessToken(userData);
  const newRefreshToken = await generateRefreshToken(userData);

  const newRefreshHash = await hashToken(newRefreshToken);
  const expiresAt = new Date(Date.now() + parseToMs(ENV.JWT_REFRESH_EXPIRY));

  await deleteRefreshTokenByHash(existingRefreshToken);

  await createRefreshToken({
    userId,
    tokenHash: newRefreshHash,
    expiresAt,
    userAgent: meta.userAgent,
    ip: meta.ip,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (incomingRefreshToken) => {
  if (!incomingRefreshToken || typeof incomingRefreshToken !== "string") {
    return { success: true, message: "No active session found" };
  }

  const hashedRefreshToken = await hashToken(incomingRefreshToken);
  await deleteRefreshTokenByHash(hashedRefreshToken);

  return {
    message: "Logged out successfully",
  };
};

export const logoutAllUser = async (userId) => {
  await deleteRefreshTokenByUserId(userId);

  return {
    message: "Successfully logged out from all devices.",
  };
};

export const getActiveSessions = async (userId) => {
  const sessions = await findSessionsByUserId(userId);

  if (sessions.length == 0) {
    throw new ApiError(404, "No active session found");
  }

  return {
    sessions,
  };
};

export const revokeSpecificSession = async (userId, sessionId) => {
  if (!sessionId) {
    throw new ApiError(400, "Session Id is required");
  }

  const deletedSession = await deleteRefreshTokenById(sessionId, userId);

  if (!deletedSession) {
    throw new ApiError(404, "Session not found or already revoked");
  }

  return {
    message: "Session revoked successfully",
  };
};
