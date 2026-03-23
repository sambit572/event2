import { Schema, model } from "mongoose";

const bankDetailsSchema = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    ifscCode: {
      type: String,
      required: [true, "IFSC code is required"],
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"],
    },
    gst: {
      type: String,
    },
    upiId: {
      type: String,
    },

    panNumber: {
      type: String,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card format"],
    },
  },
  { timestamps: true }
);

export const BankDetails = model("BankDetails", bankDetailsSchema);
