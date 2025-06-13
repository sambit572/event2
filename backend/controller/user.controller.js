import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { User } from "../model/user.model.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import jwt from "jsonwebtoken";
import {isValidPhoneNumber} from 'libphonenumber-js'

const option = {
  httpOnly: true,
  secure: false,
  sameSite: "Lax",
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(`error in generating token : ${error}`)
    return { error: "Something went wrong while generating tokens" };
  }
};

const registerUser = async (req, res) => {
  try {
    // Note: Changed `phoneNo` to `phoneNumber` for consistency with common schema patterns
    const { fullName, email, phoneNumber, password } = req.body;

    // Basic input validation
    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json(new ApiError(400, "All fields are required."));
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json(new ApiError(400, "Please provide a valid email address."));
    }

    // Password length validation
    if (password.length < 6) {
      return res
        .status(400)
        .json(new ApiError(400, "Password must be at least 6 characters long."));
    }

    // Check if user already exists by email or phone number
    const userExist = await User.findOne({ $or: [{ email }, { phoneNumber }] }); // Consistent with phoneNumber
    if (userExist) {
      // It's generally better to return 409 Conflict for existing resources
      return res
        .status(409) // Changed status to 409 for conflict
        .json(new ApiError(409, "User with this email or phone number already exists."));
    }

    // Create new user (password will be hashed by a pre-save hook in user.model.js)
    const user = await User.create({
      fullName,
      email: email.toLowerCase(), // Store email in lowercase
      phoneNumber, // Consistent with phoneNumber
      password,
    });

    // Generate access and refresh tokens
    const { accessToken, refreshToken, error: tokenError } = await generateAccessAndRefreshTokens(user._id);

    // Handle token generation error
    if (tokenError) {
      return res.status(500).json(new ApiError(500, tokenError));
    }

    // Fetch the created user, excluding sensitive fields
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken" // Assuming accessToken is not stored directly on user
    );

    if (!createdUser) {
      // This case should ideally not happen if user.create was successful
      return res.status(500).json(new ApiError(500, "User creation failed, unable to retrieve user data."));
    }

    // Set cookies and send success response
    return res
      .status(201) // Changed status to 201 Created
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new ApiResponse(
          201, // Consistent status
          { user: createdUser, accessToken, refreshToken },
          "User registered and logged in successfully."
        )
      );
  } catch (error) {
    console.error(`Error in registering user: ${error}`);
    // More specific error handling could be added here (e.g., Mongoose validation errors)
    return res.status(500).json(new ApiError(500, "Internal Server Error during registration."));
  }
};

const loginUser = async (req, res) => {
  try {
    // User can login with either email or phoneNumber
    const { email, phoneNumber, password } = req.body; // Consistent with phoneNumber

    // Check if at least one identifier (email or phoneNumber) is provided
    if (!email && !phoneNumber) {
      return res.status(400).json(new ApiError(400, "Please provide email or phone number to login."));
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json(new ApiError(400, "Please provide a valid email address."));
    }

    // Validate phone number format if provided (using libphonenumber-js for 'IN' locale)
    if (phoneNumber && !isValidPhoneNumber(phoneNumber, "IN")) {
      return res.status(400).json(new ApiError(400, "Invalid phone number format for India."));
    }

    // Password validation
    if (!password) {
      return res.status(400).json(new ApiError(400, "Password is required."));
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json(new ApiError(400, "Password must be at least 8 characters long for login."));
    }

    // Find user by email or phone number, explicitly select password for comparison
    const existUser = await User.findOne({ $or: [{ email }, { phoneNumber }] }).select('+password'); // Consistent with phoneNumber

    if (!existUser) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    // Compare provided password with hashed password (method from user.model.js)
    const isCorrect = await existUser.isPasswordCorrect(password);
    if (!isCorrect) {
      return res.status(401).json(new ApiError(401, "Incorrect password."));
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken, error: tokenError } = await generateAccessAndRefreshTokens(existUser._id);

    if (tokenError) {
      return res.status(500).json(new ApiError(500, tokenError));
    }

    // Fetch logged-in user details, excluding sensitive data
    const loggedInUser = await User.findById(existUser._id).select(
      "-password -refreshToken"
    );

    // Set cookies and send success response
    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error(`error in logging user : ${error}`);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const logoutUser = async (req, res) => {
  try {
    // Assuming req.user is populated by an authentication middleware
    if (!req.user || !req.user._id) {
      return res.status(401).json(new ApiError(401, "Unauthorized: User not authenticated."));
    }

    // Unset the refresh token in the database
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

    // Clear cookies and send success response
    return res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json(new ApiResponse(200, {}, "User logged out successfully."));
  } catch (error) {
    console.error(`Error in logging out user: ${error}`);
    return res.status(500).json(new ApiError(500, "Internal Server Error during logout."));
  }
};

const sendPasswordResetLink = async (req, res) => {
  try {
    console.log("🔹 Received request for password reset");

    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json(new ApiError(400, "Please provide a valid email address."));
    }
    console.log(`✅ Email received: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ Error: User with email ${email} not found`);
      return res.status(404).json(new ApiError(404, "User not found."));
    }
    console.log(`✅ User found: ${user.email}`);

    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log(`🔹 Generated reset token: ${resetToken}`);

    // Hash the reset token before storing it in the database for security
    // Your previous code was missing the hashing of the token before saving
    const hashedResetToken = await bcrypt.hash(resetToken, 10); // Hash the token
    user.resetPasswordToken = hashedResetToken; // Store the HASHED token
    user.resetPasswordTokenExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save({ validateBeforeSave: false }); // Save without re-running all validations
    console.log("✅ Hashed reset token saved to database");

    // Construct the reset link to be sent in the email
    // The actual token (unhashed) is sent to the user
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log(`🔹 Reset URL: ${resetUrl}`);

    // Configure Nodemailer for sending emails
    // Ensure EMAIL_USER and EMAIL_PASS are set in your .env
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or other services like 'smtp.mailtrap.io' for testing
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
    };

    console.log(`🔹 Sending email to ${user.email}`);


    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset link sent to your email."));
  } catch (error) {
    console.error("❌ Error in sendPasswordResetLink:", error);
    // If an error occurs, clear the token to prevent malicious use if it was partially saved
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        user.resetPasswordToken = undefined; // Use undefined to remove field
        user.resetPasswordTokenExpires = undefined; // Use undefined to remove field
        await user.save({ validateBeforeSave: false });
      }
    } catch (cleanUpError) {
      console.error("Error cleaning up reset token after send error:", cleanUpError);
    }
    return res
      .status(500)
      .json(new ApiError(500, error.message || "Internal Server Error during password reset link generation."));
  }
};
const resetPassword = async (req, res) => {
  try {
    console.log("🔹 Reset password request received");

    const { resetToken } = req.params;

    const { newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json(new ApiError(400, "Token and new password are required.")); // Consistent with ApiError
    }

    if (newPassword.length < 8) {
        return res
          .status(400)
          .json(new ApiError(400, "New password must be at least 8 characters long."));
    }

    // Find the user by comparing the provided resetToken with the HASHED token in the database
    // Iterate through all users to find a match (less efficient but necessary for bcrypt)
    const users = await User.find({ resetPasswordTokenExpires: { $gt: Date.now() } }).select('+resetPasswordToken');
    let user = null;
    for (const u of users) {
        if (u.resetPasswordToken && await bcrypt.compare(resetToken, u.resetPasswordToken)) {
            user = u;
            break;
        }
    }

    if (!user) {
      return res.status(400).json(new ApiError(400, "Invalid or expired token.")); // Consistent with ApiError
    }

    console.log("✅ Valid reset token found for:", user.email);

    // Update password (pre-save middleware in model will handle hashing)
    user.password = newPassword;

    // Clear reset token fields (use undefined to remove from document)
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false }); // Save without re-running all validations

    console.log("✅ Password reset successfully for:", user.email);
    return res.status(200).json(new ApiResponse(200, null, "Password reset successfully.")); // Consistent with ApiResponse
  } catch (error) {
    console.error("❌ Error in resetPassword:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error during password reset.")); // Consistent with ApiError
  }
};


const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Email, old password, and new password are required"
          )
        );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json(new ApiError(400, "Please provide a valid email address."));
    }

    // Find user by email, explicitly select password to compare
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    // Compare old password with stored hashed password
    const isSame = await bcrypt.compare(oldPassword, user.password);
    if (!isSame) {
      return res.status(400).json(new ApiError(400, "Incorrect old password."));
    }

    // New password cannot be the same as old password
    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json(new ApiError(400, "New password cannot be the same as old password."));
    }

    if (newPassword.length < 8) {
        return res
          .status(400)
          .json(new ApiError(400, "New password must be at least 8 characters long."));
    }

    // Update password (pre-save middleware in model will hash it)
    user.password = newPassword;
    await user.save({ validateBeforeSave: false }); // Save without re-running all validations

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password changed successfully."));
  } catch (error) {
    console.error(`Error in changing password: ${error}`);
    return res.status(500).json(new ApiError(500, "Internal Server Error during password change."));
  }
};


const noNeedToLogin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json(new ApiResponse(401, null, "No refresh token found. User needs to log in."));
    }

    console.log("🔹 Refresh token found:", refreshToken);
    let decodedToken;
    try {
      // Verify the refresh token
      decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      console.log("✅ Refresh token decoded:", decodedToken);
    } catch (err) {
      console.error("❌ Refresh token verification error:", err);
      // Clear potentially invalid/expired cookies
      res.clearCookie("accessToken", option).clearCookie("refreshToken", option);
      return res
        .status(401)
        .json(new ApiError(401, "Invalid or expired refresh token. Please log in again."));
    }

    // Find the user associated with the refresh token
    // Ensure User model has `select: false` on refreshToken if needed
    const user = await User.findById(decodedToken._id);

    if (!user || user.refreshToken !== refreshToken) {
      console.log("❌ User not found or refresh token mismatch.");
      // Clear cookies if token is valid but doesn't match the user's stored token
      res.clearCookie("accessToken", option).clearCookie("refreshToken", option);
      return res.status(401).json(new ApiError(401, "Refresh token mismatch or user not found. Please log in again."));
    }

    console.log("✅ User found for refresh token:", user.email);

    // Generate new access and refresh tokens
    const { accessToken, refreshToken: newRefreshToken, error: tokenError } = await generateAccessAndRefreshTokens(user._id);

    if (tokenError) {
      return res.status(500).json(new ApiError(500, tokenError));
    }

    // Fetch user details, excluding sensitive data, for response
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    console.log("✅ New tokens generated and user logged in via refresh token.");
    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newRefreshToken, option) // Send the new refresh token
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken: newRefreshToken }, // Include new refresh token in response
          "User logged in successfully through refresh token."
        )
      );
  } catch (error) {
    console.error("❌ Error in noNeedToLogin:", error);
    // Ensure cookies are cleared on any unexpected error during this flow
    res.clearCookie("accessToken", option).clearCookie("refreshToken", option);
    return res.status(500).json(new ApiError(500, "Internal Server Error during refresh token validation."));
  }
};

// Export all controller functions
export {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetLink,
  resetPassword,
  changePassword,
  noNeedToLogin,
};
