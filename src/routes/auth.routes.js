import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import verifyRefreshToken from "../middlewares/verifyRefreshToken.middleware.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.middleware.js";

import {
  registerUserController,
  loginUserController,
  refreshUserTokenController,
  logoutUserController,
  logoutAllUserController,
  getActiveSessionsController,
  revokeSpecificSessionController,
  changePasswordController,
} from "../controllers/auth.controller.js";

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
  asyncHandler(logoutAllUserController),
);

router.get(
  "/sessions",
  verifyAccessToken,
  asyncHandler(getActiveSessionsController),
);

router.post(
  "/change-password",
  verifyAccessToken,
  asyncHandler(changePasswordController),
);

router.delete(
  "/sessions/:id",
  verifyAccessToken,
  asyncHandler(revokeSpecificSessionController),
);

export default router;
