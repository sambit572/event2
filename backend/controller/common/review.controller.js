/**
 * Review Controller Documentation
 *
 * Change Summary:
 * The strategy for creating a new review has been updated. Previously, a Review instance was created using the `new Review({...})` constructor and then saved with `review.save()`. Now, the controller uses `Review.create({...})` directly to insert the review into the database.
 *
 * Why this is better:
 * - **Atomic Operation:** `Review.create()` combines instantiation and saving into a single atomic operation, reducing the risk of partial or inconsistent data states.
 * - **Cleaner Code:** The code is more concise and easier to read, as it eliminates the need for two separate steps (instantiation and save).
 * - **Error Handling:** Any validation or schema errors are caught immediately within the `create` call, making error handling more straightforward.
 * - **Performance:** Slightly more efficient as it avoids creating an unsaved Mongoose document in memory before persisting.
 *
 * Functionality:
 * - The overall functionality remains unchanged: a review is created and stored in the database, and the response structure is the same.
 *
 * In summary, this change improves code clarity, reliability, and efficiency without altering the external behavior of the API.
 */
import mongoose from "mongoose";
import { UserReview } from "../../model/user/userReview.model.js";
import { Review } from "../../model/common/review.model.js";
import { User } from "../../model/user/user.model.js";

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

    // await review.save();
    const review = await UserReview.create({
      serviceId: serviceId,
      userId: userId,
      rating: rating,
      reviewMessage: reviewMessage,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("❌ Error adding review:", error);
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this service",
      });
    }
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to add review",
        error: error.message,
      });
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

    const reviews = await UserReview.aggregate([
      {
        $match: {
          serviceId: mongoose.Types.ObjectId.createFromHexString(serviceId),
        },
      },
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid serviceId" });
    }

    // --- Ratings Breakdown (all ratings, with or without reviewMessage) ---
    const agg = await UserReview.aggregate([
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
    const totalReviews = await UserReview.countDocuments({
      serviceId: new mongoose.Types.ObjectId(serviceId),
      reviewMessage: { $nin: [null, ""] },
    });

    res.json({
      success: true,
      data: {
        averageRating: avgRating,
        totalRatings, // all ratings
        totalReviews, // only with reviewMessage
        breakdown,
      },
    });
  } catch (err) {
    console.error("getServiceRatingSummary error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    console.log("Fetching reviews with query:", req.query);

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page number must be greater than 0",
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100",
      });
    }

    // Optional filter by reviewType
    const reviewType = req.query.reviewType;
    const filter = {};

    if (reviewType) {
      if (!["product", "vendorService"].includes(reviewType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid reviewType. Must be 'product' or 'vendorService'",
        });
      }
      filter.reviewType = reviewType;
    }

    console.log("Using filter:", filter);

    // Fetch reviews
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments(filter);

    console.log(`Found ${reviews.length} reviews out of ${totalReviews} total`);

    // Enrich reviews
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        try {
          const email = review.userEmail || "";
          const emailPrefix = email ? email.split("@")[0] : "Unknown User";
          const emailInitial = email ? email.charAt(0).toUpperCase() : "U";

          const user = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
          });

          let userName = "";
          let profileImage = "";
          let initials = "";

          if (user) {
            userName =
              user.fullName ||
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              emailPrefix;
            profileImage = user.profilePhoto || user.profileImage || "";
          } else {
            console.log(`User not found for email: ${review.userEmail}`);
            userName = emailPrefix;
          }

          // Generate initials
          if (userName) {
            const parts = userName.trim().split(" ");
            initials = parts
              .map((p) => p[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
          } else {
            initials = emailInitial;
          }

          return {
            ...review.toObject(),
            userName,
            profileImage,
            initials,
          };
        } catch (userError) {
          console.error(`Error enriching review ${review._id}:`, userError);
          return {
            ...review.toObject(),
            userName: review.userEmail
              ? review.userEmail.split("@")[0]
              : "Unknown User",
            profileImage: "",
            initials: review.userEmail
              ? review.userEmail.charAt(0).toUpperCase()
              : "U",
          };
        }
      })
    );

    // Response
    res.status(200).json({
      success: true,
      totalReviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
      reviewsPerPage: limit,
      reviews: enrichedReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
