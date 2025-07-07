import multer from "multer";
import fs from "fs";
import path from "path";

const tempDir = path.join("public", "temp");

// Ensure directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// ✅ Accept both image and video files
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/mov",
  "video/avi",
  "video/wmv",
  "video/flv",
];

const allowedExtensions = [
  ".jpeg",
  ".jpg",
  ".png",
  ".gif",
  ".mp4",
  ".webm",
  ".mov",
  ".avi",
  ".wmv",
  ".flv",
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filenames
  },
});

// ✅ Filter: Images + Videos only
const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
  const isExtValid = allowedExtensions.includes(ext);

  if (isMimeTypeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image/video files are allowed (JPG, PNG, MP4, etc.)"));
  }
};

// ✅ File size limit: 10MB (reasonable for videos)
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
