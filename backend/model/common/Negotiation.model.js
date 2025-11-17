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
    vendorLocation: {
      type: [String],
      required: true,
    },
    vendorDecision: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    picked_call: {
      type: Boolean,
      default: false,
    },
    serviceType: {
      type: String,
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
    call_status: {
      type: Boolean,
      default: false,
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
    // ✅ NEW: Catering-specific fields
    packageName: {
      type: String,
      default: null,
    },
    plateCount: {
      type: Number,
      default: null,
    },
    pricePerPlate: {
      type: Number,
      default: null,
    },
    totalPrice: {
      type: Number,
      default: null,
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
      type: Boolean,
      default: false,
    },
    progress: {
      type: Boolean,
      default: false,
    },
    booked: {
      type: Boolean,
      default: false,
    },
    finalPrice: {
      type: Number,
      default: null, // vendor sets this when responding
    },
  },
  { timestamps: true }
);

export const Negotiation = mongoose.model("Negotiation", negotiationSchema);
