import { File } from "../models/file.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFile = asyncHandler(async (req, res) => {
  const file = req?.file;

  if (!file) throw new ApiError(401, "File is required!");

  const result = await File.create({
    uniqueName: file.filename,
    originalName: file.originalname,
    extention: file.mimetype.split("/").at(-1),
    uploadedBy: req.user._id,
  });
  if (!result) throw new ApiError(400, "Something went wrong");

  res
    .status(201)
    .json(new ApiResponse(200, result, "File uploaded successfully"));
});

const getFiles = asyncHandler(async (req, res) => {
  const _id = req.user._id;

  const files = await File.find({ uploadedBy: _id }).select(
    "originalName uniqueName extention"
  );

  let fileArray = [];

  for (const file of files) {
    const matchedFiles = await File.find({ uniqueName: file.uniqueName });
    fileArray = [...fileArray, ...matchedFiles];
  }

  res
    .status(200)
    .json(new ApiResponse(200, fileArray, "Files fetached successfully"));
});

const streamFileContent = asyncHandler(async (req, res) => {
  const uniqueName = req.params.uniqueName;

  const filePath = path.join(__dirname, "../assets/uploads", uniqueName);

  const file = await File.findOne({ uniqueName });

  if (!file || !fs.existsSync(filePath)) {
    throw new ApiError(404, "File not found");
  }

  let contentType = "application/octet-stream";
  if (
    file.extention === "png" ||
    file.extention === "jpeg" ||
    file.extention === "jpg"
  ) {
    contentType = "image/jpeg";
  } else if (file.extention === "pdf") {
    contentType = "application/pdf";
  }

  if (contentType !== "application/octet-stream") {
    res.setHeader("Content-Type", contentType);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } else {
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${uniqueName}.${file.extention}"`
    );
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }
});

const downloadFile = asyncHandler(async (req, res) => {
  const uniqueName = req.params.uniqueName;

  if (!uniqueName) throw new ApiError(404, "File parameter is not present");

  const filePath = path.join(__dirname, "../assets/uploads", uniqueName);

  const file = await File.findOne({ uniqueName });

  if (!file || !fs.existsSync(filePath)) {
    throw new ApiError(404, "File not found");
  }

  const contentType = "application/octet-stream";
  res.setHeader("Content-Type", contentType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${uniqueName}.${file.extention}"`
  );

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

export { uploadFile, downloadFile, getFiles, streamFileContent };
