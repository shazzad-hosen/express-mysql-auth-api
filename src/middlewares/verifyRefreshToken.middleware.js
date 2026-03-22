import ApiError from "../utils/ApiError.js";
import { findRefreshTokenByHash } from "../repositories/token.repository.js";
import { decodeRefreshToken, generateTokenHash } from "../utils/generateTokens.js";

const verifyRefreshToken = async (req, res, next) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return next(new ApiError(401, "Refresh token missing"));
  }

  try {
    const decoded = await decodeRefreshToken(token);

    const hashedToken = await generateTokenHash(token);
    const existingToken = await findRefreshTokenByHash(hashedToken);

    if (!existingToken) {
      return next(new ApiError(403, "Invalid session. Please login again."));
    }

    if (new Date(existingToken.expires_at) < new Date()) {
      return next(new ApiError(401, "Refresh token expired"));
    }

    req.userId = decoded.id;
    req.refreshToken = existingToken.token_hash;

    next();
  } catch (error) {
    return next(new ApiError(401, "Session invalid or expired"));
  }
};

export default verifyRefreshToken;
