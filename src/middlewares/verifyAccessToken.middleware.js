import ApiError from "../utils/ApiError.js";
import { decodeAccessToken } from "../utils/generateTokens.js";
import { findUserById } from "../repositories/user.repository.js";

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Not authorized, invalid token format"));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Not authorized, token missing"));
  }

  try {
    const decoded = await decodeAccessToken(token);

    const user = await findUserById(decoded.sub);

    if (!user) {
      return next(new ApiError(401, "User no longer exists"));
    }
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired"));
    }
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export default verifyAccessToken;
