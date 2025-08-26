import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewMessage: {
      type: String,
      required: true,
    },
    reviewType: {
      type: String,
      enum: ["product", "vendorService"], // allow homepage only if type === "product"
      required: true,                      // forces intentional classification
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
