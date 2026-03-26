import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../config/env.js";

export const generateAccessToken = async (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role || "user",
    },
    ENV.JWT_ACCESS_SECRET,
    {
      expiresIn: ENV.JWT_ACCESS_EXPIRY,
    },
  );
};

export const generateRefreshToken = async (user) => {
  return jwt.sign(
    {
      id: user.id,
      jti: crypto.randomBytes(16).toString("hex"),
    },
    ENV.JWT_REFRESH_SECRET,
    {
      expiresIn: ENV.JWT_REFRESH_EXPIRY,
    },
  );
};

export const generateTokenHash = async (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const decodeRefreshToken = async (token) => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
};

export const decodeAccessToken = async (token) => {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
};

export const generateOtp = async () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateOtpHash = async (OTP) => {
  return crypto.createHash("sha256").update(OTP).digest("hex");
};
