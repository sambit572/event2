import express from "express";
import { upload } from "../../middleware/multer.middleware.js";
import { createService } from "../../controller/service.controller.js";

import {
  registerVendor,
  getVendorById,
  updateVendor,
} from "../../controller/vendor.controller.js";

import {
  createBankDetails,
  deleteBankDetails,
  getBankDetailsByVendor,
  updateBankDetails,
} from "../../controller/bankdetails.controller.js";

const vendor_router = express.Router();

// --- Vendor Routes ---
vendor_router.post(
  "/register",
  upload.single("profilePicture"),
  registerVendor
);

// GET /api/vendors/:id - Get vendor details by their ID
vendor_router.get("/:id", getVendorById);

// PUT /api/vendors/:id -
vendor_router.put("/:id", upload.single("profilePicture"), updateVendor);

vendor_router
  .route("/create-service")
  .post(upload.array("images", 5), createService);

vendor_router.post(
  "/bank-details",
  upload.single("panCardPic"),
  createBankDetails
);

// Get bank details by vendor ID
vendor_router.get("/bank-details/:vendorId", getBankDetailsByVendor); // after vendor registration complete change

// Update bank details by vendor ID
vendor_router.put("/bank-details/:vendorId", updateBankDetails); // after vendor registration complete change


// Delete bank details by vendor ID
vendor_router.delete("/bank-details/:vendorId", deleteBankDetails); // after vendor registration complete change



export { vendor_router };
