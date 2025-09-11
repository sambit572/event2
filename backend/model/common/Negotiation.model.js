import mongoose from "mongoose";

const negotiationSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
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
    bookedBy: {
      type: String,
      required: true,
    },
    bookedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
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
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Negotiation = mongoose.model("Negotiation", negotiationSchema);
