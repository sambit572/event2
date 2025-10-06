import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    serviceCategory: {
      type: String,
      required: true,
    },
    serviceImage: {
      type: [String],
      required: true,
    },
    maxPrice: {
      type: Number,
      required: true,
    },
    minPrice: {
      type: Number,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    stateLocationOffered: {
      type: [String],
      required: true,
    },
    locationOffered: {
      type: [String],
      required: true,
    },
    serviceDes: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    customWhyChooseUs: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 5; // Maximum 5 points
        },
        message: 'Cannot have more than 5 "Why Choose Us" points',
      },
    },
  },
  { timestamps: true }
);

export const Service = model("Service", serviceSchema);
