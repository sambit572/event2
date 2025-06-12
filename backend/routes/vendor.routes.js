import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { createService } from "../controller/service.controller.js";

import {
  registerVendor,
  getVendorById,
  updateVendor,
} from "../controller/vendor.controller.js";

const router = express.Router();

// --- Vendor Routes ---
router.post("/register", upload.single("profilePicture"), registerVendor);

// GET /api/vendors/:id - Get vendor details by their ID
router.get("/:id", getVendorById);

// PUT /api/vendors/:id -
router.put("/:id", upload.single("profilePicture"), updateVendor);

router.route("/create-service").post(upload.array("images", 5), createService);

export default router;
