import { Router } from "express";
import {
  changePassword,
  loginUser,
  logoutUser,
  noNeedToLogin,
  registerUser,
  resetPassword,
  sendPasswordResetLink,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  removeProfilePhoto  // Add this import
} from "../../controller/user/user.controller.js";
import { verifyJwt } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";

const router = Router();

router.route("/").get(noNeedToLogin);
router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

router.route("/forgot-password").post(sendPasswordResetLink);
router.route("/reset-password/:resetToken").post(resetPassword);
router.route("/change-password").post(verifyJwt, changePassword);

router.get("/profile", verifyJwt, getUserProfile);
router.put("/update-profile", verifyJwt, updateUserProfile);

router.put("/upload-profile-photo", verifyJwt, upload.single('profilePhoto'), updateUserAvatar);
router.delete("/remove-profile-photo", verifyJwt, removeProfilePhoto);  

export default router;