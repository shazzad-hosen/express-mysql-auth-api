import ApiError from "../utils/ApiError.js";
import { decodeToken } from "../utils/generateTokens.js";

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  let token;

  if (authHeader && authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized, token missing"));
  }

  try {
    const decoded = await decodeToken(token);

    req.userId = decoded.sub;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export default verifyAccessToken;
