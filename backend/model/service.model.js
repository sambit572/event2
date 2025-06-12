import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    vendorid: {
      type: Schema.Types.ObjectId,
      ref:"Vendor",
    },
    serviceCategory: {
      type: String,
      required: true,
    },
    serviceImage: {
      type: String,
      required: true,
    },
    priceRange: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    duration: {
      type: TimeRanges,
    },
    locationOffered: {
      type: String,
      required: true,
    },
    serviceDes: {
      type: string,
    },
  },
  { timestamps: true }
);

export const Service = model("Service", serviceSchema);
