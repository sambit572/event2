import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // optional if you want to link specific service
      required:true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    additionalNotes: {
      type: String,
    },

    // Payment
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    paymentMode: {
      type: String,
      enum: ["ONLINE", "COD", "WALLET", "UPI", "BANK_TRANSFER"],
      default: "ONLINE",
      required:true,
    },
    paymentDate: {
      type: Date,
      required:true,
    },
    transactionId: {
      type: String,
      required:true,
    },

    // Invoice
    invoiceUrl: {
      type: String, // cloud/s3 link
    },
    invoiceGeneratedAt: {
      type: Date,
    },

    // Status
    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "EXPIRED"],
      default: "PENDING",
    },

    // Flags and Metadata
    isReviewed: {
      type: Boolean,
      default: false,
      required:true,
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);