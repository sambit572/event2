import mongoose from "mongoose";

const vendorBookingSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    // Basic info
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Payment
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    paymentMode: {
      type: String,
      enum: ["ONLINE", "COD", "WALLET", "UPI", "BANK_TRANSFER"],
      required: true,
      default: "ONLINE",
    },
    paymentDate: { type: Date },
    transactionId: { type: String },

    // Booking status
    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "EXPIRED"],
      default: "PENDING",
    },

    // Optional
    invoiceUrl: { type: String },
    isReviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("VendorBooking", vendorBookingSchema);
