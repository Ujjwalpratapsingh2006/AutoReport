import express from "express";
import {register, login, refreshTokens, logout} from "../controllers/auth.controllers.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh-tokens",refreshTokens);
router.post("/logout",logout);

export default router;
