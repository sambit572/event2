import multer from "multer";
import fs from "fs";
import path from "path";

const tempDir = path.join("public", "temp");

// Ensure directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// ✅ File filter: Allow only JPG, JPEG, PNG
const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png/;
  const isMimeTypeValid = allowedTypes.test(file.mimetype);
  const isExtValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (isMimeTypeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png image files are allowed"));
  }
};

// ✅ File size limit: 2MB
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
