import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    selectedType: {
      type: String,
      enum: ["user", "vendor", "service"],
      required: true,
    },
    reason: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-review", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);

// reporterId, targetType,reason,description, status,
