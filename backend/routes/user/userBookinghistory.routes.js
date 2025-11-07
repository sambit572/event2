import express from "express";
import { verifyJwt } from "../../middleware/auth.middleware.js";
import {
  createUserBookingHistory,
  getUserBookingHistory,
  updateUserHistory,
} from "../../controller/user/userBookinghistory.controller.js";

const router = express.Router();


router.post("/create", verifyJwt, createUserBookingHistory);

router.put("/update-history", verifyJwt, updateUserHistory);

// 📜 Fetch user’s full booking history
router.get("/my-bookings", verifyJwt, getUserBookingHistory);

export default router;
