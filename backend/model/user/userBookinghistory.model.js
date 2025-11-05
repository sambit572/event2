import mongoose from "mongoose";

const userBookingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },

    // Booking Details
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Payment Info
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    paymentMode: {
      type: String,
      enum: ["ONLINE", "COD", "WALLET", "UPI", "BANK_TRANSFER"],
      default: "ONLINE",
    },
    transactionId: { type: String },
    paymentDate: { type: Date },

    // Booking Status
    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "EXPIRED"],
      default: "PENDING",
    },

    // Optional info
    notes: { type: String },
    isReviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Fix: Prevent OverwriteModelError
const UserBookingHistory =
  mongoose.models.UserBookingHistory ||
  mongoose.model("UserBookingHistory", userBookingHistorySchema);

export default UserBookingHistory;
