import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    // Flag to identify if this is a catering service
    isCateringService: {
      type: Boolean,
      default: false,
    },
    // Catering-specific details (only populated if isCateringService is true)
    cateringDetails: {
      packageName: {
        type: String,
        required: function () {
          return this.isCateringService;
        },
      },
      plateCount: {
        type: Number,
        required: function () {
          return this.isCateringService;
        },
        min: 1,
      },
      pricePerPlate: {
        type: Number,
        required: function () {
          return this.isCateringService;
        },
        min: 0,
      },
      totalPrice: {
        type: Number,
        required: function () {
          return this.isCateringService;
        },
        min: 0,
      },
      minPlates: {
        type: Number,
      },
      maxPlates: {
        type: Number,
      },
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ========================================
// ✅ FIXED INDEX STRATEGY
// ========================================

// Index 1: For regular (non-catering) services
// Ensures each service appears only once per user for non-catering
cartSchema.index(
  { userId: 1, serviceId: 1, isCateringService: 1 },
  {
    unique: true,
    partialFilterExpression: { isCateringService: false },
  }
);

// Index 2: For catering services with different packages
// Allows multiple packages from same service, differentiated by packageName
cartSchema.index(
  { userId: 1, serviceId: 1, "cateringDetails.packageName": 1 },
  {
    unique: true,
    partialFilterExpression: { isCateringService: true },
  }
);

// Additional indexes for query performance
cartSchema.index({ userId: 1, createdAt: -1 });

export const Cart = mongoose.model("Cart", cartSchema);
