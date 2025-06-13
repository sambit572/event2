import { BankDetails } from "../model/bankDetails.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utilities/cloudinary.js";

import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";

// chnage "pan card pic upload" from regular to private in production as otherwise may violate indian law :

// IT Act, 2000 (India)

// Aadhaar & PAN privacy regulations

// DPDP Bill (Digital Personal Data Protection), 2023


export const createBankDetails = async (req, res) => {
  try {
    const {
      vendorid,
      accountHolderName,
      accountNumber,
      branchName,
      ifscCode,
      gst,
      upiId,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Pan Card image is required, please upload it.",
      });
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryResponse?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload PAN card to Cloudinary.",
      });
    }

    const newDetails = await BankDetails.create({
      vendorid,
      accountHolderName,
      accountNumber,
      branchName,
      ifscCode,
      gst,
      upiId,
      panCardPic: cloudinaryResponse.secure_url, // Save Cloudinary URL
    });

    res.status(201).json({
      success: true,
      message: "Bank details created successfully",
      data: newDetails,
    });
  } catch (error) {
    console.error("Error creating bank details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Getting bank details by vendor ID
export const getBankDetailsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const details = await BankDetails.findOne({ vendorid: vendorId });

    if (!details) {
      return res.status(404).json(new ApiError(404,"Bank details can't be found"));
    }

    res.status(200).json(new ApiResponse(200,details,"Bank details fetched successfully"));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateBankDetails = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const updateData = { ...req.body };

    const bankDetails = await BankDetails.findOne({ vendorid: vendorId });

    if (!bankDetails) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found",
      });
    }

    // If file uploaded, replace old image
    if (req.file) {
      await deleteFromCloudinary(bankDetails.panCardPic);

      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResponse?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload PAN card to Cloudinary.",
        });
      }

      updateData.panCardPic = cloudinaryResponse.secure_url;
    }

    const updated = await BankDetails.findOneAndUpdate(
      { vendorid: vendorId },
      updateData,
      { new: true, validateModifiedOnly: true }
    );

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating bank details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating bank details",
    });
  }
};


// Deleting bank details by vendor ID
export const deleteBankDetails = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const bankDetails = await BankDetails.findOne({ vendorid: vendorId });

    if (!bankDetails) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found to delete",
      });
    }

    // Delete image from Cloudinary (extraction handled inside utility)
    await deleteFromCloudinary(bankDetails.panCardPic);

    // Delete bank detail from DB
    await BankDetails.deleteOne({ vendorid: vendorId });

    res.status(200).json({
      success: true,
      message: "Bank details and PAN card image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bank details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
