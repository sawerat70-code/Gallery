import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");

// Make sure the folder exists before Multer tries to write into it
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
 filename: (req, file, cb) => {
  const extensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };

  const ext = extensions[file.mimetype];

  if (!ext) {
    return cb(new Error("Unsupported image type"));
  }

  const base = path
    .basename(file.originalname, path.extname(file.originalname))
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()
    .slice(0, 40);

  cb(null, `${Date.now()}-${base}${ext}`);
},
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only image files are allowed"));
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
