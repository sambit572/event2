import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
  {
    bookedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookedBy: {
      type: String,
      required: true,
    },
    serviceId: {
      type: [mongoose.Schema.Types.ObjectId], // assuming it's from your services collection
      ref: "Service",
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^\d{10}$/, // basic 10-digit phone validation
    },
    altPhone: {
      type: String,
      match: /^\d{10}$/,
      default: "",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    landmark: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
      match: /^\d{6}$/, // basic Indian pincode validation
    },
    country: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true }
);

export const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
