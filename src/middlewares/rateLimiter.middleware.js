import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis.js";

const createLimiter = ({ windowMs, max, message }) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
      sendCommand: (...args) => redis.call(...args),
    }),
  });
};

export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});

export const authLimiter = createLimiter({
  windowMs: 25 * 60 * 1000,
  max: 10,
  message: "Too many auth attempts, try again later",
});

export const otpLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 4,
  message: "Too many OTP requests, please wait",
});

export const refreshLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many refresh attempts",
});
