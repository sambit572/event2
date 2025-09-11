import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add a compound index to prevent duplicates and speed up lookups
cartSchema.index({ userId: 1, serviceId: 1 }, { unique: true });

// Change the last line from module.exports to the modern export syntax
export const Cart = mongoose.model("Cart", cartSchema);
