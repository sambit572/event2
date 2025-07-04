import Vendor from "../../model/vendor/vendor.model.js";

import { ApiError } from "../../utilities/ApiError.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import fs from "fs/promises";
import path from "path";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { validateEmailDomain } from "../../utilities/verifyDNS.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { User } from "../../model/user/user.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "Lax",
};

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

    const { accessToken, refreshToken } = await generateVendorTokens(
      newVendor._id
    );

    // 5. Return success response
    return res
      .status(200)
      .cookie("vendorAccessToken", accessToken, cookieOptions)
      .cookie("vendorRefreshToken", refreshToken, cookieOptions)
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

const generateVendorTokens = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId);
  const accessToken = vendor.generateAccessToken();
  const refreshToken = vendor.generateRefreshToken();
  vendor.refreshToken = refreshToken;
  await vendor.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const loginVendor = async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  if (!(email || phoneNumber) || !password)
    return res
      .status(400)
      .json(new ApiError(400, "Email/Phone and password required"));

  const vendor = await Vendor.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (!vendor)
    return res.status(404).json(new ApiError(404, "Vendor not found"));
  const valid = await vendor.comparePassword(password);
  if (!valid)
    return res.status(400).json(new ApiError(400, "Incorrect password"));

  const { accessToken, refreshToken } = await generateVendorTokens(vendor._id);
  const data = await Vendor.findById(vendor._id).select(
    "-password -refreshToken -accessToken"
  );
  return res
    .status(200)
    .cookie("vendorAccessToken", accessToken, cookieOptions)
    .cookie("vendorRefreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { vendor: data, accessToken, refreshToken },
        "Vendor logged in successfully"
      )
    );
};

// ✅ Logout Vendor
const vendorLogout = async (req, res) => {
  if (req.vendor && req.vendor._id) {
    await Vendor.findByIdAndUpdate(req.vendor._id, {
      $unset: { refreshToken: 1 },
    });
  }
  return res
    .status(200)
    .clearCookie("vendorAccessToken", cookieOptions)
    .clearCookie("vendorRefreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Vendor logged out"));
};

// ✅ Forgot Password
const sendVendorResetLink = async (req, res) => {
  const { email } = req.body;
  const vendor = await Vendor.findOne({ email });
  if (!vendor)
    return res.status(404).json(new ApiError(404, "Vendor not found"));

  const resetToken = crypto.randomBytes(32).toString("hex");
  vendor.resetPasswordToken = resetToken;
  vendor.resetPasswordTokenExpires = Date.now() + 3600000;
  await vendor.save();

  const resetUrl = `${process.env.FRONTEND_URL}/vendor/reset-password/${resetToken}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: vendor.email,
    subject: "Vendor Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  };
  await transporter.sendMail(mailOptions);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Reset link sent to vendor email"));
};

// ✅ Reset Password
const resetVendorPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  const vendor = await Vendor.findOne({
    resetPasswordToken: resetToken,
    resetPasswordTokenExpires: { $gt: Date.now() },
  });

  if (!vendor)
    return res.status(400).json(new ApiError(400, "Token invalid or expired"));

  vendor.password = newPassword;
  vendor.resetPasswordToken = undefined;
  vendor.resetPasswordTokenExpires = undefined;
  await vendor.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Vendor password reset successfully"));
};

// ✅ Change Password (requires auth, uses req.vendor from middleware)
const changeVendorPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const vendor = await Vendor.findById(req.vendor._id);

  const valid = await bcrypt.compare(oldPassword, vendor.password);
  if (!valid)
    return res.status(400).json(new ApiError(400, "Incorrect old password"));
  if (oldPassword === newPassword)
    return res
      .status(400)
      .json(new ApiError(400, "New password cannot be same as old"));

  vendor.password = newPassword;
  await vendor.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
};

// ✅ Silent Login (with vendor refresh token)
const vendorSilentLogin = async (req, res) => {
  const token = req.cookies.vendorRefreshToken;
  if (!token)
    return res.status(401).json(new ApiResponse(401, null, "No token"));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid or expired token"));
  }

  const vendor = await Vendor.findById(decoded._id);
  if (!vendor)
    return res.status(404).json(new ApiError(404, "Vendor not found"));

  const { accessToken, refreshToken } = await generateVendorTokens(vendor._id);

  console.log("vendorSilentLogin working fine ");

  return res
    .status(200)
    .cookie("vendorAccessToken", accessToken, cookieOptions)
    .cookie("vendorRefreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { vendor, accessToken },
        "Vendor login via refresh successful"
      )
    );
};

const checkVendorEmailStatus = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existsInVendor = await Vendor.exists({ email });
    const existsInUser = await User.exists({ email });

    return res.status(200).json({
      existsInVendor: Boolean(existsInVendor),
      existsInUser: Boolean(existsInUser),
    });
  } catch (error) {
    console.error("Error checking email status:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerVendor,
  updateVendor,
  loginVendor,
  vendorLogout,
  sendVendorResetLink,
  resetVendorPassword,
  changeVendorPassword,
  vendorSilentLogin,
  checkVendorEmailStatus,
};
