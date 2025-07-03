import { Consent } from "../../model/vendor/legalConsent.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utilities/cloudinary.js";

import { ApiResponse } from "../../utilities/ApiResponse.js";
import { ApiError } from "../../utilities/ApiError.js";

// Create legal consent
export const createLegalConsent = async (req, res) => {
  try {
    const { vendorId, iAgreeTC, iAgreeCP, iAgreeKYCVerifyUsingPanAndAdhar } =
      req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Signature is required, please upload it.",
      });
    }

    // Upload signature to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryResponse?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload signature to Cloudinary.",
      });
    }

    const newConsent = await Consent.create({
      vendorId,
      iAgreeTC,
      iAgreeCP,
      iAgreeKYCVerifyUsingPanAndAdhar,
      signature: cloudinaryResponse.secure_url, // Save Cloudinary URL
    });

    console.log("consent backend working fine...");
    res.status(201).json({
      success: true,
      message: "Legal consent created successfully",
      data: newConsent,
    });
  } catch (error) {
    console.error("Error creating legal consent:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Getting legal consent by vendor ID
export const getLegalConsentByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const consent = await Consent.findOne({ vendorId: vendorId });

    if (!consent) {
      return res
        .status(404)
        .json(new ApiError(404, "Legal consent can't be found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, consent, "Legal consent fetched successfully")
      );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update legal consent
export const updateLegalConsent = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const updateData = { ...req.body };

    const consent = await Consent.findOne({ vendorId: vendorId });

    if (!consent) {
      return res.status(404).json({
        success: false,
        message: "Legal consent not found",
      });
    }

    // If new signature uploaded, replace old one
    if (req.file) {
      await deleteFromCloudinary(consent.signature);

      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResponse?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload signature to Cloudinary.",
        });
      }

      updateData.signature = cloudinaryResponse.secure_url;
    }

    const updated = await Consent.findOneAndUpdate(
      { vendorId: vendorId },
      updateData,
      { new: true, validateModifiedOnly: true }
    );

    res.status(200).json({
      success: true,
      message: "Legal consent updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating legal consent:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating legal consent",
    });
  }
};

// Delete legal consent by vendor ID
export const deleteLegalConsent = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const consent = await Consent.findOne({ vendorId: vendorId });

    if (!consent) {
      return res.status(404).json({
        success: false,
        message: "Legal consent not found to delete",
      });
    }

    // Delete signature from Cloudinary
    await deleteFromCloudinary(consent.signature);

    // Delete consent from DB
    await Consent.deleteOne({ vendorId: vendorId });

    res.status(200).json({
      success: true,
      message: "Legal consent and signature deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting legal consent:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
