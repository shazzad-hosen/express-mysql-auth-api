import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis.js";

const createStore = (prefix) =>
  new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix,
  });

const createLimiter = ({ windowMs, max, message, prefix }) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),

    store: createStore(prefix),
  });
};

export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
  prefix: "rl:global:",
});

export const authLimiter = rateLimit({
  windowMs: 25 * 60 * 1000,
  max: 15,
  skipSuccessfulRequests: true,

  message: {
    success: false,
    message: "Too many auth attempts, try again later",
  },

  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),

  store: createStore("rl:auth:"),
});

export const otpLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests, please wait",
  prefix: "rl:otp:",
});

export const refreshLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 12,
  message: "Too many refresh attempts",
  prefix: "rl:refresh:",
});
