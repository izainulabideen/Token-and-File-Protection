import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ACCESS_TOKEN_SECRET } from "../constants.js";
import { isTokenRevoked } from "../utils/token.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    let token = req.cookies?.accessToken || "";

    const authHeader =
      req.body.headers?.Authorization || req.headers["authorization"];
    if (authHeader && typeof authHeader === "string") {
      token = authHeader.replace("Bearer ", "");
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized request !");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if (await isTokenRevoked(decodedToken.jti)) {
      throw new ApiError(401, "Token revoked");
    }

    if (
      decodedToken.ip !== req.ip ||
      decodedToken.userAgent !== req.headers["user-agent"]
    ) {
      throw new ApiError(403, "Token IP or User-Agent mismatch");
    }

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
