import { registerUser, loginUser } from "../services/auth.service.js";

import { ENV } from "../config/env.js";
import { parseToMs } from "../utils/parseToMs.js";

export const registerUserController = async (req, res) => {
  const result = await registerUser(req.body);

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
