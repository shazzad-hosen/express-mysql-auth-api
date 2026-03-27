import ApiError from "../utils/ApiError.js";

export const requireVerified = (req, res, next) => {
  if (!req.user.is_verified) {
    return next(
      new ApiError(403, "Please verify your email to access this resource"),
    );
  }
  next();
};
