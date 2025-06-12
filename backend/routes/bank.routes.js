import express from "express";
import {
  createBankDetails,
  getBankDetailsByVendor,
  updateBankDetails,
  deleteBankDetails,
} from "../controller/bankdetails.controller.js";

const router = express.Router();

// Create new bank details
router.post("/", createBankDetails);

// Get bank details by vendor ID
router.get("/:vendorId", getBankDetailsByVendor);

// Update bank details by vendor ID
router.put("/:vendorId", updateBankDetails);

// Delete bank details by vendor ID
router.delete("/:vendorId", deleteBankDetails);

export default router;
