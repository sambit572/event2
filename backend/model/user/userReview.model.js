// backend/models/review.model.js
import mongoose from "mongoose";

const userReviewSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link to User
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    reviewMessage: {
      type: String,
      //  required: true,
    },
  },
  { timestamps: true }
);

// Optional: one review per user per service
userReviewSchema.index({ serviceId: 1, userId: 1 }, { unique: true });

// Prevent OverwriteModelError during hot reload/dev
export const UserReview = mongoose.model("UserReview", userReviewSchema);

