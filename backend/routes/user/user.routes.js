import { Router } from "express";
import {
  noNeedToLogin,
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetLink,
  updateUserProfile,
  updateUserAvatar,
  removeProfilePhoto, // Add this import
  getUserEmail,
  resetPassword,
  changePassword,
  getUserProfile,
} from "../../controller/user/user.controller.js";

import { upload } from "../../middleware/multer.middleware.js";
import { verifyJwt } from "../../middleware/auth.middleware.js";

const router = Router();

//
// 🔓 PUBLIC ROUTES
//
router.get("/", noNeedToLogin);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", sendPasswordResetLink);
router.post("/reset-password/:resetToken", resetPassword);

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

export default router;
