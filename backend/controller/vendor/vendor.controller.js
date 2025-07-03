import Vendor from "../../model/vendor/vendor.model.js";

import { ApiError } from "../../utilities/ApiError.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import fs from "fs/promises";
import path from "path";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { validateEmailDomain } from "../../utilities/verifyDNS.js";

const registerVendor = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // 1. Basic Validation
    if ([fullName, email, phoneNumber, password].some((field) => !field)) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "All required fields (full name, email, phone number, password) must be provided."
          )
        );
    }

    const isValidDns = await validateEmailDomain(email);
    if (!isValidDns) {
      return res.status(400).json(new ApiError(400, "Invalid email domain"));
    }
    // 2. Check if vendor already exists
    const existingVendor = await Vendor.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingVendor) {
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            "A vendor with this email or phone number already exists."
          )
        );
    }

    // 3. Optional: Upload to Cloudinary
    let profilePictureUrl = "";
    if (req.file) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.path);
      if (!cloudinaryResult?.url) {
        return res
          .status(500)
          .json(
            new ApiError(500, "Failed to upload profile picture to Cloudinary.")
          );
      }
      profilePictureUrl = cloudinaryResult.url;
    }

    // 4. Create Vendor
    const newVendor = await Vendor.create({
      fullName,
      email,
      phoneNumber,
      password,
      profilePicture: profilePictureUrl, // May be empty string
    });

    // 5. Return success response
    return res
      .status(200)
      .json(new ApiResponse(200, newVendor, "Vendor registered successfully."));
  } catch (error) {
    console.error("Vendor registration error:", error);

    // Mongoose schema validation
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json(new ApiError(400, `Validation failed: ${messages.join(", ")}`));
    }

    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const getVendorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find vendor by ID and exclude the password field
    const vendor = await Vendor.findById(id).select("-password");
    if (!vendor) {
      return next(new ApiError(404, "Vendor not found."));
    }

    // Send successful response
    res
      .status(200)
      .json(new ApiResponse(200, vendor, "Vendor retrieved successfully."));
  } catch (error) {
    console.error("Error retrieving vendor by ID:", error);
    if (error.name === "CastError") {
      return next(new ApiError(400, "Invalid vendor ID format."));
    }
    next(
      new ApiError(
        500,
        "An internal server error occurred while retrieving vendor."
      )
    );
  }
};

const updateVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent direct password and confirmPassword updates via this route for security.
    // Password updates should typically go through a separate route (e.g., /change-password).
    delete updateData.password;
    delete updateData.confirmPassword;

    // Handle profile picture if uploaded for update
    if (req.file) {
      const oldVendor = await Vendor.findById(id);
      if (oldVendor && oldVendor.profilePicture) {
        // Construct full path to old profile picture for deletion
        const oldProfilePictureFullPath = path.join(
          __dirname,
          "..",
          oldVendor.profilePicture
        );
        try {
          // Attempt to delete the old profile picture to avoid stale files
          await fs.unlink(oldProfilePictureFullPath);
          console.log(
            `Deleted old profile picture: ${oldProfilePictureFullPath}`
          );
        } catch (unlinkError) {
          console.warn(
            `Could not delete old profile picture ${oldProfilePictureFullPath}: ${unlinkError.message}`
          );
          // Don't throw error if deletion fails, just log it.
        }
      }
      updateData.profilePicture = path.join(
        "uploads",
        "profile-pictures",
        req.file.filename
      );
    }

    // Find and update the vendor by ID.
    // 'new: true' returns the modified document rather than the original.
    // 'runValidators: true' runs schema validators on the update operation.
    const updatedVendor = await Vendor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude password from the returned document

    // If vendor not found, return a 404 error
    if (!updatedVendor) {
      return next(new ApiError(404, "Vendor not found for update."));
    }

    // Send successful response
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedVendor, "Vendor updated successfully.")
      );
  } catch (error) {
    console.error("Error updating vendor:", error);

    // If a new file was uploaded during an update and an error occurred, delete it.
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
        console.log(
          `Deleted newly uploaded file due to update error: ${req.file.path}`
        );
      } catch (unlinkError) {
        console.error(
          "Error deleting new file after update error:",
          unlinkError
        );
      }
    }

    // Handle Mongoose validation errors during update
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(
        new ApiError(
          400,
          `Validation failed during update: ${errorMessages.join(", ")}`
        )
      );
    }

    // Handle Mongoose duplicate key error during update (if trying to update to an existing email/phone)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(
        new ApiError(409, `Another vendor already exists with this ${field}.`)
      );
    }

    next(
      new ApiError(
        500,
        "An internal server error occurred during vendor update."
      )
    );
  }
};
const checkServiceExists = async (req, res, next) => {
  try {
    // Your checkServiceExists logic here
    
  } catch (error) {
    console.error("Error checking service existence:", error);
    next(new ApiError(500, "An internal server error occurred while checking service."));
  }
};



export { registerVendor, getVendorById, updateVendor,checkServiceExists };
