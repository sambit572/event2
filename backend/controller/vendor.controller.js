
import Vendor from '../model/vendor.model.js'; 


import {ApiError} from '../utilities/ApiError.js'; 
import {ApiResponse} from '../utilities/ApiResponse.js';
import fs from 'fs/promises'; 
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * @description Registers a new vendor in the database.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
const registerVendor = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, password, confirmPassword } = req.body;

    // 1. Basic Validation: Check if all required fields are present
    if ([fullName, email, phoneNumber, password, confirmPassword].some(field => !field)) {
      return next(new ApiError(400, 'All required fields (full name, email, phone number, password, confirm password) must be provided.'));
    }

    // 2. Password Match Check
    if (password !== confirmPassword) {
      return next(new ApiError(400, 'Passwords do not match.'));
    }

    // 3. Check for existing vendor by email or phone number
    const existingVendor = await Vendor.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingVendor) {
      // If a vendor exists with the same email or phone number, return a conflict error
      return next(new ApiError(409, 'A vendor with this email or phone number already exists.'));
    }

    // 4. Handle profile picture upload
    let profilePicturePath = null;
    if (req.file) {
      profilePicturePath = path.join('uploads', 'profile-pictures', req.file.filename);
    }

    // 5. Create new vendor instance
    const newVendor = new Vendor({
      fullName,
      email,
      phoneNumber,
      password, 
      profilePicture: profilePicturePath 
    });

    // 6. Save the new vendor to the database
    const savedVendor = await newVendor.save();

    // 7. Prepare response: Remove sensitive data (password) before sending
    const vendorResponse = savedVendor.toObject();
    delete vendorResponse.password; 

    // 8. Send successful response
    res.status(201).json(
      new ApiResponse(201, vendorResponse, 'Vendor registered successfully.')
    );

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Vendor registration error:', error);
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path); 
        console.log(`Deleted partially uploaded file: ${req.file.path}`);
      } catch (unlinkError) {
        console.error('Error deleting partially uploaded file:', unlinkError);
      }
    }

    // Handle Mongoose validation errors (e.g., schema validation)
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return next(new ApiError(400, `Validation failed: ${errorMessages.join(', ')}`));
    }

    // Handle Mongoose duplicate key error (if email/phoneNumber fields have unique index)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(new ApiError(409, `A vendor with this ${field} already exists.`));
    }
    next(new ApiError(500, 'An internal server error occurred during vendor registration.'));
  }
};

/**
 * @description Retrieves vendor details by ID.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
const getVendorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find vendor by ID and exclude the password field
    const vendor = await Vendor.findById(id).select('-password');
    if (!vendor) {
      return next(new ApiError(404, 'Vendor not found.'));
    }

    // Send successful response
    res.status(200).json(
      new ApiResponse(200, vendor, 'Vendor retrieved successfully.')
    );

  } catch (error) {
    console.error('Error retrieving vendor by ID:', error);
    if (error.name === 'CastError') {
      return next(new ApiError(400, 'Invalid vendor ID format.'));
    }
    next(new ApiError(500, 'An internal server error occurred while retrieving vendor.'));
  }
};

/**
 * @description Updates existing vendor details by ID.
 * Prevents password and confirmPassword from being updated directly via this route.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
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
        const oldProfilePictureFullPath = path.join(__dirname, '..', oldVendor.profilePicture);
        try {
          // Attempt to delete the old profile picture to avoid stale files
          await fs.unlink(oldProfilePictureFullPath);
          console.log(`Deleted old profile picture: ${oldProfilePictureFullPath}`);
        } catch (unlinkError) {
          console.warn(`Could not delete old profile picture ${oldProfilePictureFullPath}: ${unlinkError.message}`);
          // Don't throw error if deletion fails, just log it.
        }
      }
      updateData.profilePicture = path.join('uploads', 'profile-pictures', req.file.filename);
    }

    // Find and update the vendor by ID.
    // 'new: true' returns the modified document rather than the original.
    // 'runValidators: true' runs schema validators on the update operation.
    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from the returned document

    // If vendor not found, return a 404 error
    if (!updatedVendor) {
      return next(new ApiError(404, 'Vendor not found for update.'));
    }

    // Send successful response
    res.status(200).json(
      new ApiResponse(200, updatedVendor, 'Vendor updated successfully.')
    );

  } catch (error) {
    console.error('Error updating vendor:', error);

    // If a new file was uploaded during an update and an error occurred, delete it.
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
        console.log(`Deleted newly uploaded file due to update error: ${req.file.path}`);
      } catch (unlinkError) {
        console.error('Error deleting new file after update error:', unlinkError);
      }
    }

    // Handle Mongoose validation errors during update
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return next(new ApiError(400, `Validation failed during update: ${errorMessages.join(', ')}`));
    }

    // Handle Mongoose duplicate key error during update (if trying to update to an existing email/phone)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(new ApiError(409, `Another vendor already exists with this ${field}.`));
    }

    next(new ApiError(500, 'An internal server error occurred during vendor update.'));
  }
};

// Export all controller functions for use in routes
// Changed from module.exports to named exports for ES Modules
export {
  registerVendor,
  getVendorById,
  updateVendor
};
