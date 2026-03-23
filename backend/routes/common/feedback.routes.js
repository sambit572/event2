import express from "express";
import { Review } from "../../model/common/review.model.js";

const router = express.Router();

// POST /reviews - Submit a review
router.post("/", async (req, res) => {
  try {
    const { name, text, rating, image } = req.body;

    // Validation: name, text, and rating are required
    if (!name || !text || !rating) {
      return res.status(400).json({
        success: false,
        message: "Name, text, and rating are required.",
      });
    }

    const newReview = await Review.create({
      name,
      text,
      rating,
      image: image || null, // Optional image handling
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: newReview,
    });
  } catch (err) {
    console.error("❌ Error saving review:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

// GET /reviews - Get latest 10 reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(10);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
    });
  }
});

export default router;
