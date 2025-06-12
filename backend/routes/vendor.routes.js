import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url'; 


import {
  registerVendor,
  getVendorById,
  updateVendor
} from '../controller/vendor.controller.js';

const router = express.Router();

// --- Configuration for ES Modules  ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads (profile pictures)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads', 'profile-pictures'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); 
  } else {
   
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

// --- Vendor Routes ---
router.post('/register', upload.single('profilePicture'), registerVendor);

// GET /api/vendors/:id - Get vendor details by their ID
router.get('/:id', getVendorById);

// PUT /api/vendors/:id - 
router.put('/:id', upload.single('profilePicture'), updateVendor);

// GET /api/vendors 
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vendor routes are working correctly!'
  });
});
export default router;
