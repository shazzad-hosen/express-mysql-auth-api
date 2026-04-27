import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../config/redis.js";

const createLimiter = ({ requests, window, prefix }) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix,
  });
};

export const globalLimiter = createLimiter({
  requests: 100,
  window: "15 m",
  prefix: "rl:global",
});

export const authLimiter = createLimiter({
  requests: 15,
  window: "25 m",
  prefix: "rl:auth",
});

export const otpLimiter = createLimiter({
  requests: 5,
  window: "15 m",
  prefix: "rl:otp",
});

export const refreshLimiter = createLimiter({
  requests: 12,
  window: "15 m",
  prefix: "rl:refresh",
});
