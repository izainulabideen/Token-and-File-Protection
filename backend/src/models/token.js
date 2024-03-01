import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const Token = mongoose.model("Token", tokenSchema);
