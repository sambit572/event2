import mongoose from "mongoose";

const userBookingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetails",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    // Booking Details
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Payment Info
    amount: { type: Number, default: 0 },
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
    transactionId: { type: String, default: "" },
    paymentDate: { type: Date, default: "" },

    // Booking Status
    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "EXPIRED"],
      default: "PENDING",
    },

    reDirectTo: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },

    /*
    reDirectTo variable is used for redirection purpose and written for user, currently this has nothing to do with vendor.
    
    1: Is for redirecting user to it's negotiation modal using userDetailsId
    2: Is for redirecting user to its order-summary page using userDetailsId
    3: is for future like when the whole process completed a page designed may be same as order-summary but with feedback option will be added.
    
    */
  },
  { timestamps: true }
);

// ✅ Fix: Prevent OverwriteModelError
export const UserBookingHistory =
  mongoose.models.UserBookingHistory ||
  mongoose.model("UserBookingHistory", userBookingHistorySchema);
