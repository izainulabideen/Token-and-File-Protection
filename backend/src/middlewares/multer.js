import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirPath = path.join(__dirname, "../assets/uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now(+"-" + Math.round(Math.random() * 1e9));
    cb(null, uniqueSuffix + "-" + uuidv4());
  },
});

export const upload = multer({
  storage,
});
