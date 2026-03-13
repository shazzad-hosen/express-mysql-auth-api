import express from "express";
import asyncHandler from "../utils/asyncHandler.js";

import { registerUserController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", asyncHandler(registerUserController));

export default router;
