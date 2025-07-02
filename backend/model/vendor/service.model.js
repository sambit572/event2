import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    vendorid: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    serviceCategory: {
      type: String,
      required: true,
    },
    serviceImage: {
      type: [String], 
      required: true,
    },
    priceRange: {
      type: String,
      required: false, 
    },
    minPrice: {
      type: Number,
      required: false,
    },
    serviceName: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    locationOffered: {
      type: String,
      required: true,
    },
    serviceDes: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Service = model("Service", serviceSchema);
