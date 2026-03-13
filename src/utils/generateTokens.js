import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../config/env.js";

export const generateAccessToken = async (user) => {
  return jwt.sign({ id: user.id }, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRY,
  });
};

export const generateRefreshToken = async (user) => {
  return jwt.sign({ id: user.id }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRY,
  });
};

export const hashToken = async (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
