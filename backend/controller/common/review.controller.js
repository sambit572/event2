import mongoose from "mongoose";
import { User } from "../../model/user/user.model.js";
import Review from "../../model/user/userReview.model.js";

// Add a new review
export const addReview = async (req, res) => {
  try {
    const { serviceId, rating, reviewMessage } = req.body;

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not logged in" });
    }

    const userId = req.user._id;

    console.log("Incoming review data:", {
      serviceId,
      rating,
      reviewMessage,
      userId,
    });

    const review = new Review({
      serviceId,
      userId,
      rating,
      reviewMessage,
    });

    await review.save();

    res.status(201).json({ success: true, review });
  } catch (err) {
    console.error("Add Review Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to add review" });
  }
};

// Get reviews by service
export const getReviewsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid serviceId" });
    }

    const reviews = await Review.aggregate([
      { $match: { serviceId: new mongoose.Types.ObjectId(serviceId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
       {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          rating: 1,
          reviewMessage: 1,
          createdAt: 1,
          "userDetails._id": 1,
          "userDetails.fullName": 1,
        },
      },
    ]);

    res.status(200).json({ success: true, reviews });
  } catch (err) {
    console.error("Get Reviews Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
};

export const getServiceRatingSummary = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: "Invalid serviceId" });
    }

    // --- Ratings Breakdown (all ratings, with or without reviewMessage) ---
    const agg = await Review.aggregate([
      { $match: { serviceId: new mongoose.Types.ObjectId(serviceId) } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRatings = 0;
    let totalScore = 0;

    agg.forEach((r) => {
      breakdown[r._id] = r.count;
      totalRatings += r.count;
      totalScore += r._id * r.count;
    });

    const avgRating = totalRatings ? totalScore / totalRatings : 0;

    // --- Count only those with reviewMessage ---
    const totalReviews = await Review.countDocuments({
      serviceId: new mongoose.Types.ObjectId(serviceId),
      reviewMessage: { $ne: null, $ne: "" }, // only if review text exists
    });

    res.json({
      success: true,
      data: {
        averageRating: avgRating,
        totalRatings,  // all ratings
        totalReviews,  // only with reviewMessage
        breakdown,
      },
    });
  } catch (err) {
    console.error("getServiceRatingSummary error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
