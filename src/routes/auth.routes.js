import express from "express";
import asyncHandler from "../utils/asyncHandler.js";

import {
  registerUserController,
  loginUserController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", asyncHandler(registerUserController));

router.post("/login", asyncHandler(loginUserController));

export default router;
