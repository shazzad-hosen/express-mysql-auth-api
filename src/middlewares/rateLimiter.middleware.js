import ApiError from "../utils/ApiError.js";

export const rateLimit = (limiter) => {
  return async (req, res, next) => {
    try {
      const key = req.user?.id || req.ip;

      const { success } = await limiter.limit(key);

      if (!success) {
        return next(new ApiError(429, "Too many requests"));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
