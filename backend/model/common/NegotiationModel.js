import mongoose from "mongoose";

const negotiationSchema = new mongoose.Schema(
  {
    vendorName: String,
    venueLocation: String,
    proposedPrice: String,
    originalPrice: String,
    date: String,
    type: String,
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Negotiation", negotiationSchema);
