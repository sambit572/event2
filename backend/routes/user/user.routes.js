import { Router } from "express";
import {
  noNeedToLogin,
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetLink,
  updateUserProfile,
  updateUserAvatar,
  removeProfilePhoto,
  getUserEmail,
  resetPassword,
  changePassword,
  getUserProfile,
  googleAuth,
  verifyLogin,
} from "../../controller/user/user.controller.js";

import { verifyJwt } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import { getDetails, saveDetails } from "../../controller/user/userDetails.controller.js";

const router = Router();

//
// 🔓 PUBLIC ROUTES
//
router.get("/no-need-to-login", noNeedToLogin);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/auth/google", googleAuth);
router.post("/forgot-password", sendPasswordResetLink);
router.post("/reset-password/:resetToken", resetPassword);
router.post("/verify-otp", verifyLogin);

//
// 🔒 PROTECTED ROUTES (Require JWT)
//
router.post("/change-password", verifyJwt, changePassword);
router.route("/get-email").get(verifyJwt, getUserEmail);
router.get("/profile", verifyJwt, getUserProfile);

router.get("/profile", verifyJwt, getUserProfile);
router.put("/update-profile", verifyJwt, updateUserProfile);

router.put(
  "/upload-profile-photo",
  verifyJwt,
  upload.single("profilePhoto"),
  updateUserAvatar
);
router.delete("/remove-profile-photo", verifyJwt, removeProfilePhoto);

// User Details Routes
router.post("/save-details", verifyJwt, saveDetails);
router.get("/bookings/:userDetailsId", verifyJwt, getDetails);

export default router;
