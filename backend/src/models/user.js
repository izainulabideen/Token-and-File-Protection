import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../constants.js";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      // select: false, // Prevent this field from being returned by default
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (ip, userAgent) {
  return jwt.sign(
    {
      _id: this._id,
      jti: uuidv4(),
      name: this.name,
      ip,
      userAgent,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function (ip, userAgent) {
  const token = jwt.sign(
    {
      _id: this._id,
      jti: uuidv4(),
      name: this.name,
      ip,
      userAgent,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  // Save the refresh token ID to the user document
  this.refreshToken = token;
  this.save();

  return token;
};

export const User = mongoose.model("User", userSchema);
