import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { User } from "../model/user.model.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import jwt from "jsonwebtoken";
import { isValidPhoneNumber } from "libphonenumber-js";

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
    console.error(`error in generating token : ${error}`);
    return { error: "Something went wrong while generating tokens" };
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNo, password } = req.body;

    if (!fullName || !email || !password || !phoneNo) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json(new ApiError(400, "Please provide a valid email address"));
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json(new ApiError(400, "Password must be 6 character long"));
    }

    const userExist = await User.findOne({ $or: [{ email }, { phoneNo }] });

    if (userExist) {
      return res
        .status(200)
        .json(new ApiResponse(200, userExist, "User already exists"));
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phoneNo,
      password,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -accessToken"
    );

    if (!createdUser) {
      return res.status(500).json(new ApiError(500, "Unable to create user"));
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new ApiResponse(
          200,
          { user: createdUser, accessToken, refreshToken },
          "User created successfully"
        )
      );
  } catch (error) {
    console.error(`error in registering user : ${error}`);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, phoneNo, password } = req.body;

    if (!email && !phoneNo) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json(new ApiError(400, "Please provide a valid email address"));
    }

    if (phoneNo && !isValidPhoneNumber(phoneNo, "IN")) {
      return res.status(400).json(new ApiError(400, "Invalid phone number"));
    }

    if (!password) {
      return res.status(400).json(new ApiError(400, "Password required"));
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json(new ApiError(400, "Password must be 8 character long"));
    }

    const existUser = await User.findOne({ $or: [{ email }, { phoneNo }] });

    if (!existUser) {
      return res.status(404).json(new ApiError(404, "User does not exist"));
    }

    const isCorrect = await existUser.isPasswordCorrect(password);

    if (!isCorrect) {
      return res.status(400).json(new ApiError(400, "Incorrect password"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      existUser._id
    );

    if (accessToken?.error) {
      return res.status(500).json(new ApiError(500, accessToken.error));
    }

    const loggedInUser = await User.findById(existUser._id).select(
      "-password -refreshToken -accessToken"
    );

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
    // Optional: Only attempt DB update if req.user exists
    if (req.user && req.user._id) {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
      });
    }

    return res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json(new ApiResponse(200, {}, "User logged out"));
  } catch (error) {
    console.error(`error in logging out user : ${error}`);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const sendPasswordResetLink = async (req, res) => {
  try {
    console.log("🔹 Received request for password reset");

    // Step 1: Check if email is present in the request body
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json(new ApiError(400, "Please provide a valid email address"));
    }

    console.log(`✅ Email received: ${email}`);

    // Step 2: Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ Error: User with email ${email} not found`);
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    console.log(`✅ User found: ${user.email}`);

    // Step 3: Generate reset token and hash it
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log(`🔹 Generated reset token: ${resetToken}`);

    console.log(`✅ Hashed reset token saved to database`);

    // Step 4: Store hashed token and expiration time in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();
    console.log("✅ Token saved in database");

    // Step 5: Construct the reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log(`🔹 Reset URL: ${resetUrl}`);

    // Step 6: Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Step 7: Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    console.log(`🔹 Sending email to ${user.email}`);

    // Step 8: Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset link sent to email"));
  } catch (error) {
    console.error("❌ Error in sendPasswordResetLink:", error);
    const { email } = req.body;
    const user = await User.findOne({ email });
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;
    await user.save();
    return res
      .status(500)
      .json(new ApiError(500, error.message || "Internal Server Error"));
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
        .json({ error: "Token and new password are required" });
    }

    // Check if the user exists with a valid token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    console.log("✅ Valid reset token found for:", user.email);

    // Update password (pre-save middleware will handle hashing)
    user.password = newPassword;

    // Remove reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    console.log("✅ Password reset successfully for:", user.email);
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Error in resetPassword:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const oldPassword = req.body.oldPassword?.trim();
    const newPassword = req.body.newPassword?.trim();

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json(new ApiError(400, "Old password and new password are required"));
    }

    const userWithPassword = await User.findById(req.user._id);

    const isSame = await bcrypt.compare(oldPassword, userWithPassword.password);

    if (!isSame) {
      return res.status(400).json(new ApiError(400, "Incorrect old password"));
    }

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json(new ApiError(400, "New password cannot be same as old password"));
    }

    userWithPassword.password = newPassword;
    await userWithPassword.save();

    console.log("Backend working fine for change password");

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password changed successfully"));
  } catch (error) {
    console.error(`Error in changing password:`, error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const noNeedToLogin = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401).json(new ApiResponse(401, "User is loging first time"));
    }

    console.log(token);
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.log("isOldUser try-catch error: ", err);
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Token expired or invalid"));
    }

    console.log(decodedToken);
    const user = await User.findById(decodedToken._id);

    if (!user) {
      console.log("cannot find user using refresh token");
    } else {
      console.log(user);
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    if (accessToken?.error) {
      return res.status(500).json(new ApiError(500, accessToken.error));
    }

    console.log("backend logic of no need to login works fine");
    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new ApiResponse(
          200,
          { user, accessToken },
          "User logged in successfully through refresh token"
        )
      );
  } catch (error) {
    console.log("In no need to login: ", error);
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetLink,
  resetPassword,
  changePassword,
  noNeedToLogin,
};
