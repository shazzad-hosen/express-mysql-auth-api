import { Redis } from "@upstash/redis";
import { ENV } from "./env.js";

export const redis = new Redis({
  url: ENV.REDIS_URL,
  token: ENV.REDIS_TOKEN,
});