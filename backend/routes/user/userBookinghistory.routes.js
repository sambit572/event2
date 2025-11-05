import express from "express";
import { verifyJwt } from "../../middleware/auth.middleware.js";
import {
  createUserBooking,
  getUserBookingHistory,
} from "../../controller/user/userBookinghistory.controller.js";

const router = express.Router();

// 🧪 Test route (creates a booking history entry manually)
router.post("/create", verifyJwt, createUserBooking);

// 📜 Fetch user’s full booking history
router.get("/my-bookings", verifyJwt, getUserBookingHistory);

export default router;
