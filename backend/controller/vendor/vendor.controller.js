import Vendor from "../../model/vendor/vendor.model.js";
import { ApiError } from "../../utilities/ApiError.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import fs from "fs/promises";
import { isValidPhoneNumber } from "libphonenumber-js";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { validateEmailDomain } from "../../utilities/verifyDNS.js";
import { sendEmail } from "../../utilities/sendEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../../model/user/user.model.js";
import { Service } from "../../model/vendor/service.model.js";

const isProd = process.env.NODE_ENV === "production";

const baseOption = {
  httpOnly: true,
  secure: isProd ? "true" : "false", // true in prod, false in dev
  sameSite: isProd ? "None" : "Lax",
  path: "/",
};

const accessTokenOption = {
  ...baseOption,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
};

const refreshTokenOption = {
  ...baseOption,
  expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
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
      registrationProgress: 1,
    });

    const { accessToken, refreshToken } = await generateVendorTokens(
      newVendor._id
    );

    await sendEmail({
      to: email,
      subject: "🎉 Welcome to EventsBridge - Vendor Registration",
      html: `
    <h2>Hi ${fullName},</h2>
    <p>Thank you for registering as a vendor on <strong>EventsBridge</strong>!</p>
    <p><strong>Your Registration Details:</strong></p>
    <ul>
      <li><strong>Name:</strong> ${fullName}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone No:</strong> ${phoneNumber}</li>
    </ul>
    <p>We’re thrilled to have your services onboard!</p>
    <br/>
    <p>Warm regards,<br/>Team EventsBridge</p>
  `,
    });

    // 5. Return success response
    return res
      .status(200)
      .cookie("vendorAccessToken", accessToken, accessTokenOption)
      .cookie("vendorRefreshToken", refreshToken, refreshTokenOption)
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

const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    const file = req.file;

    // Never allow password updates through this route
    delete updateData.password;
    delete updateData.confirmPassword;

    console.log("Update data received:", updateData);

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res
        .status(404)
        .json(new ApiError(404, "Vendor not found for update."));
    }

    // Handle profile picture removal
    if (updateData.removeProfilePicture === "true") {
      if (
        vendor.profilePicture &&
        vendor.profilePicture.includes("cloudinary")
      ) {
        const publicId = vendor.profilePicture.split("/").pop().split(".")[0];
        await uploadOnCloudinary(null, publicId, true); // Custom delete method
      }
      updateData.profilePicture = "";
    }

    // Handle profile picture replacement
    if (file) {
      if (
        vendor.profilePicture &&
        vendor.profilePicture.includes("cloudinary")
      ) {
        const publicId = vendor.profilePicture.split("/").pop().split(".")[0];
        await uploadOnCloudinary(null, publicId, true);
      }

      const cloudinaryResult = await uploadOnCloudinary(file.path);
      if (!cloudinaryResult?.url) {
        return res
          .status(500)
          .json(new ApiError(500, "Failed to upload new profile picture."));
      }

      updateData.profilePicture = cloudinaryResult.url;
    }

    // 🚫 No bank update logic here

    const updatedVendor = await Vendor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedVendor, "Vendor updated successfully.")
      );
  } catch (error) {
    console.error("Error updating vendor:", error);

    // Clean up uploaded file if an error occurs
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Failed to delete uploaded file:", unlinkError);
      }
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            `Validation failed during update: ${messages.join(", ")}`
          )
        );
    }

    // Handle duplicate email or phone
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res
        .status(409)
        .json(
          new ApiError(409, `Another vendor already exists with this ${field}.`)
        );
    }

    // Generic internal server error
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error during vendor update."));
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
    .cookie("vendorAccessToken", accessToken, accessTokenOption)
    .cookie("vendorRefreshToken", refreshToken, refreshTokenOption)
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
    .clearCookie("vendorAccessToken", accessTokenOption)
    .clearCookie("vendorRefreshToken", refreshTokenOption)
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

  // use your central mailer
  const result = await sendEmail({
    to: vendor.email,
    subject: "Vendor Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });

  if (!result.success) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to send reset email", result.error));
  }

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
    .cookie("vendorAccessToken", accessToken, accessTokenOption)
    .cookie("vendorRefreshToken", refreshToken, refreshTokenOption)
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

const getVendorProfile = async (req, res) => {
  try {
    const vendor = req.vendor; // Set in middleware

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const verifyConfirmPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const vendor = await Vendor.findById(req.vendor._id); // check this line!

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (isMatch) {
      return res.json({ success: true });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.error("❌ Backend error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateVendorProfilePicture = async (req, res, next) => {
  try {
    const id = req.vendor._id; // 👈 Comes from JWT middleware
    const file = req.file;

    if (!file) {
      return next(new ApiError(400, "No file uploaded."));
    }

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return next(new ApiError(404, "Vendor not found."));
    }

    // Delete old image from Cloudinary (if exists)
    if (vendor.profilePicture && vendor.profilePicture.includes("cloudinary")) {
      const publicId = vendor.profilePicture.split("/").pop().split(".")[0];
      await uploadOnCloudinary(null, publicId, true); // Delete old
    }

    const cloudinaryResult = await uploadOnCloudinary(file.path);
    if (!cloudinaryResult?.url) {
      return next(new ApiError(500, "Failed to upload new profile picture."));
    }

    vendor.profilePicture = cloudinaryResult.url;
    await vendor.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, vendor, "Profile picture updated successfully.")
      );
  } catch (error) {
    console.error("Error uploading profile:", error);

    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }

    next(new ApiError(500, "Internal server error during profile update."));
  }
};
// ✅  Get Vendor Search Suggestions
const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 1) {
      return res
        .status(400)
        .json(new ApiError(400, "Search query is required"));
    }

    const searchTerm = query.trim().toLowerCase();

    const matches = await Service.aggregate([
      {
        $match: {
          $or: [
            { serviceName: { $regex: searchTerm, $options: "i" } },
            { serviceCategory: { $regex: searchTerm, $options: "i" } },
            { locationOffered: { $regex: searchTerm, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          serviceName: 1,
          serviceCategory: 1,
          locationOffered: 1,
        },
      },
      {
        $limit: 15,
      },
    ]);

    const serviceNames = new Set();
    const categories = new Set();
    const locations = new Set();

    for (const match of matches) {
      if (
        match.serviceName &&
        match.serviceName.toLowerCase().includes(searchTerm)
      ) {
        serviceNames.add(match.serviceName);
      }

      if (
        match.serviceCategory &&
        match.serviceCategory.toLowerCase().includes(searchTerm)
      ) {
        categories.add(match.serviceCategory);
      }

      if (
        match.locationOffered &&
        match.locationOffered.toLowerCase().includes(searchTerm)
      ) {
        locations.add(match.locationOffered);
      }
    }

    const suggestions = [];

    [...serviceNames].forEach((label) =>
      suggestions.push({ label, type: "service" })
    );
    [...categories].forEach((label) =>
      suggestions.push({ label, type: "category" })
    );
    [...locations].forEach((label) =>
      suggestions.push({ label, type: "location" })
    );

    if (suggestions.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, [], "No suggestions found for this search.")
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, suggestions, "Search suggestions fetched"));
  } catch (error) {
    console.error("Suggestion error:", error.message);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// dashboard
const getVendorDashboard = async (req, res) => {
  console.log("📍 getVendorDashboard called");
  try {
    const currentStep = req.vendor.registrationProgress;
    const currentPath = req.query.currentPath;

    console.log("📍 Current frontend path:", currentPath);
    console.log("🧠 Vendor DB progress:", currentStep);

    // Optional logic based on currentPath
    // You can use a map or regex to validate allowed paths for each step

    if (!currentStep || currentStep < 4) {
      let redirectTo = "";

      if (currentStep === 1) {
        redirectTo = "/category/VendorService";
      }
      if (currentStep === 2) {
        redirectTo = "/vendor/payment-info";
      }
      if (currentStep === 3) {
        redirectTo = "/vendor/legal-consent";
      }

      return res.status(200).json({
        incomplete: true,
        redirectTo,
      });
    }

    return res.status(200).json({
      incomplete: false,
      message: `Welcome to your dashboard, ${req.vendor.fullName}`,
      vendor: req.vendor,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ message: "Dashboard loading failed" });
  }
};

const verifyVendorLogin = async (req, res) => {
  const { phoneNo } = req.body;

  console.log("verifyVendorLogin called with phoneNo:", phoneNo);
  if (!phoneNo || !isValidPhoneNumber(phoneNo, "IN")) {
    return res.status(400).json(new ApiError(400, "Invalid phone number"));
  }

  const vendor = await Vendor.findOne({ phoneNumber: phoneNo });
  if (!vendor)
    return res.status(404).json(new ApiError(404, "Vendor not found"));

  const { accessToken, refreshToken } = await generateVendorTokens(vendor._id);

  const loggedInVendor = await Vendor.findById(vendor._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("vendorAccessToken", accessToken, accessTokenOption)
    .cookie("vendorRefreshToken", refreshToken, refreshTokenOption)
    .json(
      new ApiResponse(
        200,
        { loggedInVendor, accessToken, refreshToken },
        "Vendor Login successful"
      )
    );
};

export {
  registerVendor,
  loginVendor,
  vendorLogout,
  updateVendor,
  sendVendorResetLink,
  resetVendorPassword,
  changeVendorPassword,
  vendorSilentLogin,
  checkVendorEmailStatus,
  getVendorProfile,
  updateVendorProfilePicture,
  verifyConfirmPassword,
  getVendorDashboard,
  getSearchSuggestions,
  verifyVendorLogin,
};
