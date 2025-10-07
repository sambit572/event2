import mongoose from "mongoose";

const negotiationSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    vendorEmail: {
      type: String,
      required: true,
    },
    vendorPhoneNumber: {
      type: String,
      required: true,
    },
    vendorCallStatus: {
      type: Boolean, // changed from String to Boolean
      default: false, // false = "Not Picked"
    },
    vendorLocation: {
      type: [String],
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    bookedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    bookedByUser: {
      type: String,
      required: true,
    },
    bookedByUserEmail: {
      type: String,
      required: true,
    },
    bookedByUserPhoneNumber: {
      type: String,
      required: true,
    },
    bookedByUserAltPhoneNumber: {
      type: String,
      required: true,
    },
    bookedByUserCallStatus: {
      type: Boolean, // changed from String to Boolean
      default: false, // false = "Not Called"
    },
    venueLocation: {
      type: String,
      required: true,
    },
    proposedPrice: {
      type: Number,
      default: 0,
    },
    date: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    originalPriceRange: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    type: {
      type: String,
      default: "No Negotiation Requested",
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    paymentReceived: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean, // changed from String to Boolean
      default: false,
    },
    progress: {
      type: Boolean, // optional field based on your frontend
      default: false,
    },
    booked: {
      type: Boolean, // optional if tracking booking status separately
      default: false,
    },
    picked_call: {
      type: Boolean, // optional if you're tracking vendor's picked call separately
      default: false,
    },
    call_status: {
      type: Boolean, // optional if you're tracking called status
      default: false,
    },
  },
  { timestamps: true }
);

export const Negotiation = mongoose.model("Negotiation", negotiationSchema);
