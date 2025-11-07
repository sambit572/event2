import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Order amount is required."],
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "expired"],
      default: "pending",
    },
    // NEW: Field to store the reference number submitted by the user.
    userSubmittedRef: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      index: { expires: "15m" },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
