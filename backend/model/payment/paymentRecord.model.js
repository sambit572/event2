import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentRecordSchema = new mongoose.Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  // RE-ADDED: Stores the reference number entered by the confirming admin.
  transactionRef: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    enum: ["manual", "webhook", "simulated"],
    required: true,
  },
  confirmedBy: {
    type: String,
    required: true,
  },
  confirmedAt: {
    type: Date,
    default: Date.now,
  },
});

export const PaymentRecord = mongoose.model(
  "PaymentRecord",
  paymentRecordSchema
);
