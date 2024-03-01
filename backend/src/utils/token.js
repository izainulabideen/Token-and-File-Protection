import { ACCESS_TOKEN_SECRET } from "../constants.js";
import { Token } from "../models/token.js";
import { User } from "../models/user.js";
import { ApiError } from "./ApiError.js";
import jwt from "jsonwebtoken";

async function revokeToken(token) {
  const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  if (!decodedToken) throw new ApiError(401, "Invalid token");

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  const tokenId = decodedToken.jti;
  return await Token.create({
    tokenId,
    expiresAt: new Date(),
  });
}

async function isTokenRevoked(tokenId) {
  const token = await Token.findOne({ tokenId });
  return !!token;
}

export { revokeToken, isTokenRevoked };
