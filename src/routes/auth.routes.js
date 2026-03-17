import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import verifyRefreshToken from "../middlewares/verifyRefreshToken.middleware.js";

import {
  registerUserController,
  loginUserController,
  refreshUserTokenController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", asyncHandler(registerUserController));

router.post("/login", asyncHandler(loginUserController));

router.post(
  "/refresh",
  verifyRefreshToken,
  asyncHandler(refreshUserTokenController),
);

export default router;
