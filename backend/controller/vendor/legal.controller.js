import { Consent } from "../../model/vendor/legalConsent.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utilities/cloudinary.js";

import { ApiResponse } from "../../utilities/ApiResponse.js";
import { ApiError } from "../../utilities/ApiError.js";
import Vendor from "../../model/vendor/vendor.model.js";

// Create legal consent
export const createLegalConsent = async (req, res) => {
  try {
    const { vendorId, iAgreeTC, iAgreeCP, iAgreeKYCVerifyUsingPanAndAdhar } =
      req.body;

    // ✅ Ensure signature is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Signature is required, please upload it.",
      });
    }

    // ✅ Upload signature to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    if (!cloudinaryResponse?.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload signature to Cloudinary.",
      });
    }

    // ✅ Determine vendor ID (middleware or body fallback)
    const resolvedVendorId = req.vendor?._id || vendorId;
    if (!resolvedVendorId) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID missing. Authentication or vendorId is required.",
      });
    }

    // ✅ Check if vendor is already marked complete
    const existingVendor = await Vendor.findById(resolvedVendorId);
    if (!existingVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (existingVendor.isRegistrationComplete) {
      return res.status(400).json({
        success: false,
        message:
          "Registration already completed. Duplicate consent not allowed.",
      });
    }

    // ✅ Save consent in DB
    const newConsent = await Consent.create({
      vendorId: resolvedVendorId,
      iAgreeTC,
      iAgreeCP,
      iAgreeKYCVerifyUsingPanAndAdhar,
      signature: cloudinaryResponse.secure_url,
    });

    console.log("✅ Consent saved successfully...");

    // ✅ Update vendor registration progress
    const updatedVendor = await Vendor.findByIdAndUpdate(
      resolvedVendorId,
      {
        $set: {
          registrationProgress: 4, // dynamically set based on flow
          isRegistrationComplete: true,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedVendor) {
      console.error("❌ Vendor not found during update:", resolvedVendorId);
      return res.status(404).json({
        success: false,
        message: "Consent saved but failed to update vendor registration.",
      });
    }

    console.log("✅ Vendor registration marked complete:", updatedVendor);

    return res.status(201).json({
      success: true,
      message:
        "Legal consent created and vendor registration completed successfully.",
      data: { consent: newConsent, vendor: updatedVendor },
    });
  } catch (error) {
    console.error("❌ Error creating legal consent:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
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
