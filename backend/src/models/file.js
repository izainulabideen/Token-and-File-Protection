import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    uniqueName: String,
    originalName: String,
    extention: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const File = mongoose.model("File", fileSchema);
