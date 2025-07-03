import { Schema, model } from "mongoose";

const bankDetailsSchema = new Schema(
  {
    vendorid: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique : true
    },
    branchName: {
      type: String,
      required: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
    gst: {
      type: String,
    },
    upiId: {
      type: String,
    },
    panCardPic: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const BankDetails = model("BankDetails", bankDetailsSchema);
