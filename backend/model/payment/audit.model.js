import mongoose, { Schema } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true, // e.g., 'MANUAL_PAYMENT_CONFIRMATION', 'ORDER_CREATED'
    },
    actor: {
      type: String, // The user/admin who performed the action
      required: true,
    },
    details: {
      type: Schema.Types.Mixed, // Flexible object to store relevant details
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
