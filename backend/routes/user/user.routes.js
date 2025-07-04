import { Router } from "express";
import {
  changePassword,
  loginUser,
  logoutUser,
  noNeedToLogin,
  registerUser,
  resetPassword,
  sendPasswordResetLink,
} from "../../controller/user/user.controller.js";
import { verifyJwt } from "../../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(noNeedToLogin);
router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

router.route("/forgot-password").post(sendPasswordResetLink);
router.route("/reset-password/:resetToken").post(resetPassword);
router.route("/change-password").post(verifyJwt, changePassword);

export default router;
