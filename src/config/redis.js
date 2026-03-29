import Redis from "ioredis";
import { ENV } from "./env.js";

export const redis = new Redis({
  host: ENV.REDIS_HOST || "127.0.0.1",
  port: ENV.REDIS_PORT || 6379,
  password: ENV.REDIS_PASSWORD || undefined,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.log("Redis error: ", err.message);
});
