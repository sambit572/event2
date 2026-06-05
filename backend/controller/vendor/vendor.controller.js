import Vendor from "../../model/vendor/vendor.model.js";
import { User } from "../../model/user/user.model.js";
import { Service } from "../../model/vendor/service.model.js";

import { ApiError } from "../../utilities/ApiError.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";

import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { validateEmailDomain } from "../../utilities/verifyDNS.js";
import { sendEmail } from "../../utilities/sendEmail.js";

import fs from "fs/promises";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { isValidPhoneNumber } from "libphonenumber-js";

// ======================================================
// ENV
// ======================================================

const isProd = process.env.NODE_ENV === "production";

// ======================================================
// COOKIE CONFIG
// ======================================================

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  path: "/",
};

const accessTokenOption = {
  ...cookieOptions,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

const refreshTokenOption = {
  ...cookieOptions,
  expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
};

// ======================================================
// HELPERS
// ======================================================

const sendAuthResponse = (
  res,
  statusCode,
  vendor,
  accessToken,
  refreshToken,
  message
) => {
  return res
    .status(statusCode)
    .cookie(
      "vendorAccessToken",
      accessToken,
      accessTokenOption
    )
    .cookie(
      "vendorRefreshToken",
      refreshToken,
      refreshTokenOption
    )
    .json(
      new ApiResponse(
        statusCode,
        {
          vendor,
          accessToken,
          refreshToken,
        },
        message
      )
    );
};

const deleteCloudinaryImage = async (
  imageUrl
) => {
  try {
    if (
      !imageUrl ||
      !imageUrl.includes("cloudinary")
    ) {
      return;
    }

    const publicId = imageUrl
      .split("/")
      .pop()
      .split(".")[0];

    await uploadOnCloudinary(
      null,
      publicId,
      true
    );
  } catch (error) {
    console.error(
      "Cloudinary delete failed:",
      error
    );
  }
};

const generateVendorTokens = async (
  vendorId
) => {
  const vendor = await Vendor.findById(
    vendorId
  );

  if (!vendor) {
    throw new ApiError(
      404,
      "Vendor not found"
    );
  }

  const accessToken =
    vendor.generateAccessToken();

  const refreshToken =
    vendor.generateRefreshToken();

  vendor.refreshToken = refreshToken;

  await vendor.save({
    validateBeforeSave: false,
  });

  return {
    accessToken,
    refreshToken,
  };
};

// ======================================================
// REGISTER VENDOR
// ======================================================

const registerVendor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
    } = req.body;

    if (
      [
        fullName,
        email,
        phoneNumber,
        password,
      ].some((field) => !field)
    ) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "All required fields must be provided."
          )
        );
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const normalizedPhone =
      phoneNumber.trim();

    const isValidDns =
      await validateEmailDomain(
        normalizedEmail
      );

    if (!isValidDns) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Invalid email domain"
          )
        );
    }

    const existingVendor =
      await Vendor.findOne({
        $or: [
          { email: normalizedEmail },
          {
            phoneNumber:
              normalizedPhone,
          },
        ],
      });

    if (existingVendor) {
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            "Vendor already exists"
          )
        );
    }

    let profilePictureUrl = "";

    if (req.file) {
      const cloudinaryResult =
        await uploadOnCloudinary(
          req.file.path
        );

      if (!cloudinaryResult?.url) {
        return res
          .status(500)
          .json(
            new ApiError(
              500,
              "Profile picture upload failed"
            )
          );
      }

      profilePictureUrl =
        cloudinaryResult.url;
    }

    const newVendor =
      await Vendor.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        phoneNumber:
          normalizedPhone,
        password,
        profilePicture:
          profilePictureUrl,
        registrationProgress: 1,
      });

    const {
      accessToken,
      refreshToken,
    } = await generateVendorTokens(
      newVendor._id
    );

    await sendEmail({
      to: normalizedEmail,
      subject:
        "🎉 Welcome to EventsBridge",
      html: `
      <h2>Hi ${fullName},</h2>
      <p>Thank you for registering on EventsBridge.</p>
      <p>We’re excited to onboard your services.</p>
      <br/>
      <p>Team EventsBridge</p>
      `,
    });

    const vendorData =
      await Vendor.findById(
        newVendor._id
      ).select(
        "-password -refreshToken"
      );

    return sendAuthResponse(
      res,
      201,
      vendorData,
      accessToken,
      refreshToken,
      "Vendor registered successfully"
    );
  } catch (error) {
    console.error(
      "Vendor registration error:",
      error
    );

    if (error.name === "ValidationError") {
      const messages =
        Object.values(error.errors).map(
          (err) => err.message
        );

      return res
        .status(400)
        .json(
          new ApiError(
            400,
            messages.join(", ")
          )
        );
    }

    if (error.code === 11000) {
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            "Vendor already exists"
          )
        );
    }

    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal server error"
        )
      );
  }
};

// ======================================================
// LOGIN VENDOR
// ======================================================

const loginVendor = async (
  req,
  res
) => {
  try {
    const {
      email,
      phoneNumber,
      password,
    } = req.body;

    if (
      !(email || phoneNumber) ||
      !password
    ) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Email/Phone and password required"
          )
        );
    }

    const vendor =
      await Vendor.findOne({
        $or: [
          { email },
          { phoneNumber },
        ],
      });

    if (!vendor) {
      return res
        .status(404)
        .json(
          new ApiError(
            404,
            "Vendor not found"
          )
        );
    }

    if (vendor.isBlocked) {
      return res
        .status(403)
        .json(
          new ApiError(
            403,
            "Vendor account blocked"
          )
        );
    }

    const valid =
      await vendor.comparePassword(
        password
      );

    if (!valid) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Incorrect password"
          )
        );
    }

    const {
      accessToken,
      refreshToken,
    } = await generateVendorTokens(
      vendor._id
    );

    const data =
      await Vendor.findById(
        vendor._id
      ).select(
        "-password -refreshToken"
      );

    return sendAuthResponse(
      res,
      200,
      data,
      accessToken,
      refreshToken,
      "Vendor logged in successfully"
    );
  } catch (error) {
    console.error(
      "Vendor login error:",
      error
    );

    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal server error"
        )
      );
  }
};

// ======================================================
// LOGOUT
// ======================================================

const vendorLogout = async (
  req,
  res
) => {
  try {
    if (req.vendor?._id) {
      await Vendor.findByIdAndUpdate(
        req.vendor._id,
        {
          $unset: {
            refreshToken: 1,
          },
        }
      );
    }

    return res
      .status(200)
      .clearCookie(
        "vendorAccessToken",
        accessTokenOption
      )
      .clearCookie(
        "vendorRefreshToken",
        refreshTokenOption
      )
      .json(
        new ApiResponse(
          200,
          {},
          "Vendor logged out"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Logout failed"
        )
      );
  }
};

// ======================================================
// GET PROFILE
// ======================================================

const getVendorProfile = async (
  req,
  res
) => {
  try {
    return res.status(200).json(
      new ApiResponse(
        200,
        req.vendor,
        "Vendor profile fetched"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Failed to fetch profile"
        )
      );
  }
};

// ======================================================
// UPDATE PROFILE
// ======================================================

const updateVendor = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
    };

    delete updateData.password;
    delete updateData.confirmPassword;

    const vendor =
      await Vendor.findById(id);

    if (!vendor) {
      return res
        .status(404)
        .json(
          new ApiError(
            404,
            "Vendor not found"
          )
        );
    }

    if (
      updateData.removeProfilePicture ===
      "true"
    ) {
      await deleteCloudinaryImage(
        vendor.profilePicture
      );

      updateData.profilePicture = "";
    }

    if (req.file) {
      await deleteCloudinaryImage(
        vendor.profilePicture
      );

      const cloudinaryResult =
        await uploadOnCloudinary(
          req.file.path
        );

      if (!cloudinaryResult?.url) {
        return res
          .status(500)
          .json(
            new ApiError(
              500,
              "Image upload failed"
            )
          );
      }

      updateData.profilePicture =
        cloudinaryResult.url;
    }

    const updatedVendor =
      await Vendor.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedVendor,
        "Vendor updated successfully"
      )
    );
  } catch (error) {
    console.error(
      "Vendor update error:",
      error
    );

    if (req.file?.path) {
      try {
        await fs.unlink(
          req.file.path
        );
      } catch { }
    }

    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Vendor update failed"
        )
      );
  }
};

// ======================================================
// UPDATE PROFILE PICTURE
// ======================================================

const updateVendorProfilePicture =
  async (req, res) => {
    try {
      const id = req.vendor._id;

      if (!req.file) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "No image uploaded"
            )
          );
      }

      const vendor =
        await Vendor.findById(id);

      if (!vendor) {
        return res
          .status(404)
          .json(
            new ApiError(
              404,
              "Vendor not found"
            )
          );
      }

      await deleteCloudinaryImage(
        vendor.profilePicture
      );

      const cloudinaryResult =
        await uploadOnCloudinary(
          req.file.path
        );

      if (!cloudinaryResult?.url) {
        return res
          .status(500)
          .json(
            new ApiError(
              500,
              "Image upload failed"
            )
          );
      }

      vendor.profilePicture =
        cloudinaryResult.url;

      await vendor.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          vendor,
          "Profile picture updated"
        )
      );
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Profile update failed"
          )
        );
    }
  };

// ======================================================
// CHANGE PASSWORD
// ======================================================

const changeVendorPassword =
  async (req, res) => {
    try {
      const {
        oldPassword,
        newPassword,
      } = req.body;

      const vendor =
        await Vendor.findById(
          req.vendor._id
        );

      const valid =
        await bcrypt.compare(
          oldPassword,
          vendor.password
        );

      if (!valid) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "Incorrect old password"
            )
          );
      }

      if (
        oldPassword === newPassword
      ) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "New password cannot be same"
            )
          );
      }

      vendor.password =
        newPassword;

      await vendor.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          null,
          "Password changed successfully"
        )
      );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Password change failed"
          )
        );
    }
  };

// ======================================================
// VERIFY PASSWORD
// ======================================================

const verifyConfirmPassword =
  async (req, res) => {
    try {
      const { password } = req.body;

      const vendor =
        await Vendor.findById(
          req.vendor._id
        );

      if (!vendor) {
        return res
          .status(404)
          .json(
            new ApiError(
              404,
              "Vendor not found"
            )
          );
      }

      const isMatch =
        await bcrypt.compare(
          password,
          vendor.password
        );

      if (!isMatch) {
        return res
          .status(401)
          .json(
            new ApiError(
              401,
              "Incorrect password"
            )
          );
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          true,
          "Password verified"
        )
      );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Verification failed"
          )
        );
    }
  };

// ======================================================
// SILENT LOGIN
// ======================================================

const vendorSilentLogin =
  async (req, res) => {
    try {
      const token =
        req.cookies
          .vendorRefreshToken;

      if (!token) {
        return res
          .status(401)
          .json(
            new ApiError(
              401,
              "No refresh token"
            )
          );
      }

      let decoded;

      try {
        decoded = jwt.verify(
          token,
          process.env
            .REFRESH_TOKEN_SECRET
        );
      } catch {
        return res
          .status(401)
          .json(
            new ApiError(
              401,
              "Invalid token"
            )
          );
      }

      const vendor =
        await Vendor.findById(
          decoded._id
        );

      if (!vendor) {
        return res
          .status(404)
          .json(
            new ApiError(
              404,
              "Vendor not found"
            )
          );
      }

      const {
        accessToken,
        refreshToken,
      } =
        await generateVendorTokens(
          vendor._id
        );

      return sendAuthResponse(
        res,
        200,
        vendor,
        accessToken,
        refreshToken,
        "Vendor login successful"
      );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Silent login failed"
          )
        );
    }
  };

// ======================================================
// RESET PASSWORD EMAIL
// ======================================================

const sendVendorResetLink =
  async (req, res) => {
    try {
      const { email } = req.body;

      const vendor =
        await Vendor.findOne({
          email,
        });

      if (!vendor) {
        return res
          .status(404)
          .json(
            new ApiError(
              404,
              "Vendor not found"
            )
          );
      }

      const resetToken =
        crypto
          .randomBytes(32)
          .toString("hex");

      vendor.resetPasswordToken =
        resetToken;

      vendor.resetPasswordTokenExpires =
        Date.now() + 3600000;

      await vendor.save();

      const resetUrl = `${process.env.FRONTEND_URL}/vendor/reset-password/${resetToken}`;

      await sendEmail({
        to: vendor.email,
        subject:
          "Vendor Password Reset",
        html: `
        <p>
          Click
          <a href="${resetUrl}">
            here
          </a>
          to reset your password.
        </p>
        `,
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          null,
          "Reset link sent"
        )
      );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Reset link failed"
          )
        );
    }
  };

// ======================================================
// RESET PASSWORD
// ======================================================

const resetVendorPassword =
  async (req, res) => {
    try {
      const { resetToken } =
        req.params;

      const { newPassword } =
        req.body;

      const vendor =
        await Vendor.findOne({
          resetPasswordToken:
            resetToken,
          resetPasswordTokenExpires:
          {
            $gt: Date.now(),
          },
        });

      if (!vendor) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "Token invalid or expired"
            )
          );
      }

      vendor.password =
        newPassword;

      vendor.resetPasswordToken =
        undefined;

      vendor.resetPasswordTokenExpires =
        undefined;

      await vendor.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          null,
          "Password reset successful"
        )
      );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Password reset failed"
          )
        );
    }
  };

// ======================================================
// CHECK EMAIL STATUS
// ======================================================

const checkVendorEmailStatus =
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "Email required"
            )
          );
      }

      const existsInVendor =
        await Vendor.exists({
          email,
        });

      const existsInUser =
        await User.exists({
          email,
        });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            existsInVendor:
              Boolean(
                existsInVendor
              ),
            existsInUser:
              Boolean(
                existsInUser
              ),
          },
          "Email status checked"
        )
      );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Email check failed"
          )
        );
    }
  };

// ======================================================
// SEARCH SUGGESTIONS
// ======================================================

const getSearchSuggestions =
  async (req, res) => {
    try {
      const { query } =
        req.query;

      if (
        !query ||
        query.trim().length < 1
      ) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "Search query required"
            )
          );
      }

      const searchTerm = query
        .trim()
        .toLowerCase();

      const matches =
        await Service.aggregate([
          {
            $match: {
              $or: [
                {
                  serviceName: {
                    $regex:
                      searchTerm,
                    $options: "i",
                  },
                },
                {
                  serviceCategory:
                  {
                    $regex:
                      searchTerm,
                    $options: "i",
                  },
                },
                {
                  locationOffered:
                  {
                    $regex:
                      searchTerm,
                    $options: "i",
                  },
                },
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

      return res.status(200).json(
        new ApiResponse(
          200,
          matches,
          "Suggestions fetched"
        )
      );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Suggestion fetch failed"
          )
        );
    }
  };

// ======================================================
// DASHBOARD
// ======================================================

const getVendorDashboard =
  async (req, res) => {
    try {
      const currentStep =
        req.vendor
          .registrationProgress;

      const redirectMap = {
        1: "/category/VendorService",
        2: "/vendor/payment-info",
        3: "/vendor/legal-consent",
      };

      if (
        !currentStep ||
        currentStep < 4
      ) {
        return res.status(200).json({
          incomplete: true,
          redirectTo:
            redirectMap[
            currentStep
            ] || "",
        });
      }

      return res.status(200).json({
        incomplete: false,
        message: `Welcome ${req.vendor.fullName}`,
        vendor: req.vendor,
      });
    } catch (error) {
      return res
        .status(500)
        .json({
          message:
            "Dashboard loading failed",
        });
    }
  };

// ======================================================
// VERIFY LOGIN
// ======================================================

const verifyVendorLogin =
  async (req, res) => {
    try {
      const { phoneNo } =
        req.body;

      if (
        !phoneNo ||
        !isValidPhoneNumber(
          phoneNo,
          "IN"
        )
      ) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "Invalid phone number"
            )
          );
      }

      const vendor =
        await Vendor.findOne({
          phoneNumber:
            phoneNo,
        });

      if (!vendor) {
        return res
          .status(404)
          .json(
            new ApiError(
              404,
              "Vendor not found"
            )
          );
      }

      const {
        accessToken,
        refreshToken,
      } =
        await generateVendorTokens(
          vendor._id
        );

      const loggedInVendor =
        await Vendor.findById(
          vendor._id
        ).select(
          "-password -refreshToken"
        );

      return sendAuthResponse(
        res,
        200,
        loggedInVendor,
        accessToken,
        refreshToken,
        "Vendor login successful"
      );
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Vendor verification failed"
          )
        );
    }
  };

// ======================================================
// EXPORTS
// ======================================================

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