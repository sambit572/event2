import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../model/user/user.model.js";
import { ApiError } from "../../utilities/ApiError.js";
import { ApiResponse } from "../../utilities/ApiResponse.js";
import { isValidPhoneNumber } from "libphonenumber-js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utilities/cloudinary.js";
import { sendEmail } from "../../utilities/sendEmail.js";
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

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate profile picture URL with first name initial
const generateProfilePicture = (fullName) => {
  const firstName = fullName.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  // Create a data URL for SVG with the initial
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
    "#00D2D3",
    "#FF9F43",
    "#10AC84",
    "#EE5A6F",
    "#C44569",
    "#F8B500",
    "#6C5CE7",
  ];

  // Use the first character's char code to consistently pick a color
  const colorIndex = initial.charCodeAt(0) % colors.length;
  const backgroundColor = colors[colorIndex];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="${backgroundColor}"/>
    <text x="50" y="50" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" font-size="40" fill="white" font-weight="bold">${initial}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    console.log(
      `generateAccessAndRefreshTokens generates access token : ${accessToken}`
    );
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(`Error generating tokens: ${error}`);
    return { error: "Something went wrong while generating tokens" };
  }
};

// ------------------ AUTH CONTROLLERS ------------------

const registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNo, password } = req.body;
    console.log("Reaching Register user in backend");

    if (!fullName || !email || !password || !phoneNo) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json(new ApiError(400, "Invalid email format"));
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json(new ApiError(400, "Password must be 6 characters long"));
    }

    const userExist = await User.findOne({ $or: [{ email }, { phoneNo }] });

    if (userExist) {
      return res
        .status(400)
        .json(new ApiResponse(400, userExist, "User already exists"));
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phoneNo,
      password,
      profilePhoto: generateProfilePicture(fullName), // Generate default profile picture
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -accessToken"
    );

    // Send thank you email
    await sendEmail({
      to: email,
      subject: "🎉 Welcome to EventsBridge - User Registration",
      html: `
    <h2>Hi ${fullName},</h2>
    <p>Thank you for registering with <strong>EventsBridge</strong>!</p>
    <p><strong>Your Details:</strong></p>
    <ul>
      <li><strong>Name:</strong> ${fullName}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone No:</strong> ${phoneNo}</li>
    </ul>
    <p>We're excited to have you onboard.</p>
    <br/>
    <p>Best regards,<br/>Team EventsBridge</p>
  `,
    });

    if (!createdUser) {
      return res.status(500).json(new ApiError(500, "Unable to create user"));
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOption)
      .cookie("refreshToken", refreshToken, refreshTokenOption)
      .json(
        new ApiResponse(
          200,
          { user: createdUser, accessToken, refreshToken },
          "User created successfully"
        )
      );
  } catch (error) {
    console.error(`Error in registering user: ${error}`);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, phoneNo, password } = req.body;

    if (!email && !phoneNo) {
      return res
        .status(400)
        .json(new ApiError(400, "Email or phone number required"));
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json(new ApiError(400, "Invalid email format"));
    }

    if (phoneNo && !isValidPhoneNumber(phoneNo, "IN")) {
      return res.status(400).json(new ApiError(400, "Invalid phone number"));
    }

    if (!password || password.length < 8) {
      return res
        .status(400)
        .json(new ApiError(400, "Password must be 8 characters long"));
    }

    const user = await User.findOne({ $or: [{ email }, { phoneNo }] });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(400).json(new ApiError(400, "Incorrect password"));
    }

    // Generate profile picture if user doesn't have one
    if (!user.profilePhoto) {
      user.profilePhoto = generateProfilePicture(user.fullName);
      await user.save({ validateBeforeSave: false });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOption)
      .cookie("refreshToken", refreshToken, refreshTokenOption)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const logoutUser = async (req, res) => {
  try {
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
      });
    }

    return res
      .status(200)
      .clearCookie("accessToken", accessTokenOption)
      .clearCookie("refreshToken", refreshTokenOption)
      .clearCookie("accessToken", accessTokenOption)
      .clearCookie("refreshToken", refreshTokenOption)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// ---------- GOOGLE OAUTH CONTROLLER ----------
const googleAuth = async (req, res) => {
  try {
    const { token, phoneNo } = req.body; // Accept phoneNo from frontend

    // 1. verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // console.log("✅ GOOGLE PAYLOAD RECEIVED:", ticket.getPayload());

    const { email, name, picture } = ticket.getPayload();

    // console.log("Google profile picture URL:", picture);

    // 2. find or create user
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // For new users, phone number is required
      if (!phoneNo) {
        return res
          .status(400)
          .json(new ApiError(400, "Phone number is required for new users"));
      }

      // Validate phone number format
      if (!isValidPhoneNumber(phoneNo, "IN")) {
        return res
          .status(400)
          .json(new ApiError(400, "Invalid phone number format"));
      }

      // Check if phone number already exists
      const existingUserWithPhone = await User.findOne({ phoneNo });
      if (existingUserWithPhone) {
        return res
          .status(400)
          .json(new ApiError(400, "Phone number already registered"));
      }

      user = await User.create({
        fullName: name,
        email,
        phoneNo,
        profilePhoto:
          picture && picture.trim() !== ""
            ? picture
            : generateProfilePicture(name),
        password: crypto.randomBytes(16).toString("hex"), // placeholder password
      });
      isNewUser = true;

      // Send welcome email for new users
      await sendEmail({
        to: email,
        subject: "🎉 Welcome to EventsBridge - Google Registration",
        html: `
          <h2>Hi ${name},</h2>
          <p>Thank you for signing up with <strong>EventsBridge</strong> using Google!</p>
          <p><strong>Your Details:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone No:</strong> ${phoneNo}</li>
          </ul>
          <p>We're excited to have you onboard.</p>
          <br/>
          <p>Best regards,<br/>Team EventsBridge</p>
        `,
      });
    } else {
      // For existing users, update phone number if provided
      if (phoneNo && phoneNo !== user.phoneNo) {
        // Validate phone number format
        if (!isValidPhoneNumber(phoneNo, "IN")) {
          return res
            .status(400)
            .json(new ApiError(400, "Invalid phone number format"));
        }

        // Check if phone number already exists for another user
        const existingUserWithPhone = await User.findOne({
          phoneNo,
          _id: { $ne: user._id },
        });
        if (existingUserWithPhone) {
          return res
            .status(400)
            .json(new ApiError(400, "Phone number already registered"));
        }

        user.phoneNo = phoneNo;
      }

      // Update profile photo logic
      // Update profile photo logic
      if (picture && picture.trim() !== "") {
        // If Google has a valid picture, use it
        user.profilePhoto = picture;
      } else if (
        !user.profilePhoto ||
        user.profilePhoto.startsWith("data:image/svg+xml")
      ) {
        // If no Google picture and no existing profile photo (or it's generated), create one
        user.profilePhoto = generateProfilePicture(user.fullName);
      }
      // If user has a custom uploaded photo, don't change it
      await user.save();
    }

    // 3. issue tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const safeUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!safeUser) {
      return res
        .status(500)
        .json(new ApiError(500, "Unable to fetch safeUser"));
    }
    // 4. respond
    return res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOption)
      .cookie("refreshToken", refreshToken, refreshTokenOption)
      .json(
        new ApiResponse(
          200,
          { user: safeUser, accessToken, refreshToken, isNewUser },
          isNewUser ? "Google signup successful" : "Google login successful"
        )
      );
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Google authentication failed"));
  }
};

// ------------------ PROFILE CONTROLLERS ------------------

const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNo } = req.body;

    if (!fullName || !email || !phoneNo) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const user = await User.findById(req.user._id);

    // If the fullName changed and user has a generated profile picture (data URL), update it
    if (
      fullName !== user.fullName &&
      user.profilePhoto &&
      user.profilePhoto.startsWith("data:image/svg+xml")
    ) {
      user.profilePhoto = generateProfilePicture(fullName);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, email, phoneNo, profilePhoto: user.profilePhoto },
      { new: true, runValidators: true }
    ).select("fullName email phoneNo profilePhoto eventsBooked");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: updatedUser },
          "Profile updated successfully"
        )
      );
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json(new ApiError(400, "No avatar file provided"));
    }

    // Get the current user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Delete old avatar from Cloudinary if it exists and is not a generated one
    if (
      user.profilePhoto &&
      !user.profilePhoto.startsWith("data:image/svg+xml")
    ) {
      await deleteFromCloudinary(user.profilePhoto);
    }

    // Upload new avatar to Cloudinary
    const uploadResult = await uploadOnCloudinary(
      req.file.path,
      "profile_pics"
    );

    if (!uploadResult) {
      return res.status(500).json(new ApiError(500, "Failed to upload avatar"));
    }

    // Update user's profile photo URL in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: uploadResult.secure_url },
      { new: true, runValidators: true }
    ).select("fullName email phoneNo profilePhoto");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: updatedUser, avatarUrl: uploadResult.secure_url },
          "Avatar updated successfully"
        )
      );
  } catch (error) {
    console.error("Update avatar error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const removeProfilePhoto = async (req, res) => {
  try {
    // Get the current user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Check if user has a profile photo
    if (!user.profilePhoto) {
      return res
        .status(400)
        .json(new ApiError(400, "No profile photo to remove"));
    }

    // Delete the current profile photo from Cloudinary if it's not a generated one
    if (!user.profilePhoto.startsWith("data:image/svg+xml")) {
      await deleteFromCloudinary(user.profilePhoto);
    }

    // Generate a new default profile picture instead of removing completely
    const newProfilePhoto = generateProfilePicture(user.fullName);

    // Update user's profile photo to the generated one
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: newProfilePhoto },
      { new: true, runValidators: true }
    ).select("fullName email phoneNo profilePhoto eventsBooked");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: updatedUser },
          "Profile photo reset to default successfully"
        )
      );
  } catch (error) {
    console.error("Remove profile photo error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

// ------------------ PASSWORD RESET CONTROLLERS ------------------

const sendPasswordResetLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json(new ApiError(400, "Invalid email"));
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json(new ApiError(404, "User not found"));

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    return res.status(200).json(new ApiResponse(200, null, "Reset email sent"));
  } catch (error) {
    console.error("sendPasswordResetLink error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json(new ApiError(400, "Missing token or password"));
    }

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json(new ApiError(400, "Invalid or expired token"));

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset successfully"));
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json(new ApiError(400, "Old and new passwords required"));
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json(new ApiError(400, "Incorrect old password"));

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json(new ApiError(400, "New password cannot be same as old"));
    }

    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password changed successfully"));
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const verifyLogin = async (req, res) => {
  const { phoneNo } = req.body;

  if (!phoneNo || !isValidPhoneNumber(phoneNo, "IN")) {
    return res.status(400).json(new ApiError(400, "Invalid phone number"));
  }

  const user = await User.findOne({ phoneNo });
  if (!user) return res.status(404).json(new ApiError(404, "User not found"));

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOption)
    .cookie("refreshToken", refreshToken, refreshTokenOption)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "Login successful"
      )
    );
};

// ------------------ TOKEN AUTH CONTROLLER ------------------

const noNeedToLogin = async (req, res) => {
  try {
    const accessTokenFromCookie = req.cookies.accessToken;
    const refreshTokenFromCookie = req.cookies.refreshToken;

    let decodedAccess = null;
    let decodedRefresh = null;

    // 1️⃣ Check if access token exists & is valid
    if (accessTokenFromCookie) {
      try {
        decodedAccess = jwt.verify(
          accessTokenFromCookie,
          process.env.ACCESS_TOKEN_SECRET
        );
      } catch (err) {
        console.log("Access token expired or invalid.", err);
      }
    }

    // 2️⃣ If access token is valid
    if (decodedAccess) {
      const user = await User.findById(decodedAccess._id);
      if (!user)
        return res.status(404).json(new ApiError(404, "User not found"));

      // If refresh token is missing or invalid → generate a new one
      let newRefreshToken = refreshTokenFromCookie;
      if (refreshTokenFromCookie) {
        try {
          decodedRefresh = jwt.verify(
            refreshTokenFromCookie,
            process.env.REFRESH_TOKEN_SECRET
          );
        } catch (err) {
          console.log("Refresh token invalid, regenerating...");
          newRefreshToken = user.generateRefreshToken();
          user.refreshToken = newRefreshToken;
          await user.save();
        }
      } else {
        // No refresh token in cookie at all → generate a new one
        newRefreshToken = user.generateRefreshToken();
        user.refreshToken = newRefreshToken;
        await user.save();
      }

      return res
        .status(200)
        .cookie("refreshToken", newRefreshToken, refreshTokenOption)
        .json(new ApiResponse(200, user, "Session valid (access token ok)"));
    }

    // 3️⃣ If access token missing/expired → check refresh token
    if (refreshTokenFromCookie) {
      try {
        decodedRefresh = jwt.verify(
          refreshTokenFromCookie,
          process.env.REFRESH_TOKEN_SECRET
        );
      } catch (err) {
        console.log("Refresh token expired or invalid.", err);
      }

      if (decodedRefresh) {
        const user = await User.findById(decodedRefresh._id);
        if (!user)
          return res.status(404).json(new ApiError(404, "User not found"));

        // Issue a new access token
        const newAccessToken = await user.generateAccessToken();

        return res
          .status(200)
          .cookie("accessToken", newAccessToken, accessTokenOption)
          .json(
            new ApiResponse(
              200,
              { user, accessToken: newAccessToken },
              "Access token refreshed"
            )
          );
      }
    }

    // 4️⃣ Both tokens invalid → force login
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Session expired, please login"));
  } catch (error) {
    console.error("noNeedToLogin error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const getUserEmail = async (req, res) => {
  const user = await User.findById(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Email fetched successfully"));
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "fullName email phoneNo profilePhoto eventsBooked"
    );

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Generate profile picture if user doesn't have one
    if (!user.profilePhoto) {
      user.profilePhoto = generateProfilePicture(user.fullName);
      await user.save({ validateBeforeSave: false });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { user }, "Profile fetched successfully"));
  } catch (error) {
    console.error("Fetch profile error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
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
  updateUserProfile,
  updateUserAvatar,
  removeProfilePhoto,
  getUserEmail,
  getUserProfile,
  googleAuth,
  verifyLogin,
};
