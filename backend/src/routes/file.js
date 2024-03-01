import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import {
  downloadFile,
  getFiles,
  streamFileContent,
  uploadFile,
} from "../controllers/file.js";

const router = Router();

router
  .route("/upload")
  .post(verifyJWT, upload.single("fileToUpload"), uploadFile);

router.route("/download/:uniqueName").get(verifyJWT, downloadFile);
router.route("/get-files").get(verifyJWT, getFiles);
router.route("/preview/:uniqueName").get(verifyJWT, streamFileContent);

export default router;
