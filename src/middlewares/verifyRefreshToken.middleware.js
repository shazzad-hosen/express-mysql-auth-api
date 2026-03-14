import ApiError from "../utils/ApiError.js";
import { findRefreshToken } from "../repositories/token.repository.js";
import { decodeToken, hashToken } from "../utils/generateTokens.js";

const verifyRefreshToken = async (req, res, next) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return next(new ApiError(401, "Refresh token missing"));
  }

  try {
    const decoded = await decodeToken(token);

    const hashedToken = await hashToken(token);
    const existingToken = await findRefreshToken(hashedToken);

    if (!existingToken) {
      return next(new ApiError(403, "Invalid session. Please login again."));
    }

    if (new Date(existingToken.expires_at) < new Date()) {
      return next(new ApiError(401, "Refresh token expired"));
    }

    req.userId = decoded.id;
    req.tokenData = existingToken;

    next();
  } catch (error) {
    return next(new ApiError(401, "Session invalid or expired"));
  }
};

export default verifyRefreshToken;
