import { Schema, model } from "mongoose";

const consetSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "vendor",
  },
  iAgreeTC: {
    type: Boolean,
    required: true,
  },
  iAgreeCP: {
    type: Boolean,
    required: true,
  },
  iAgreeKYCVerifyUsingPanAndAdhar: {
    type: Boolean,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    default: "1.0",
  },
},

{ timestamps: true }
);

export const Consent = model("Consent", consetSchema);
