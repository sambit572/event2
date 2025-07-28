import express from "express";
import Feedback from "../../model/common/feedback.model.js";
/* import { verifyUser } from "../../middleware/auth.middleware.js"; */ // optional if user must be logged in

const router = express.Router();

// POST /feedback
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Feedback message is required." });
    }

    const userEmail = req.user?.email || req.body.email || "Anonymous"; // if using auth

    const newFeedback = await Feedback.create({
      message,
      userEmail,
    });

    return res.status(200).json({ success: true, data: newFeedback });
  } catch (err) {
    console.error("❌ Error saving feedback:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
