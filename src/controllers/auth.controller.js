import { registerUser } from "../services/auth.service.js";
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
