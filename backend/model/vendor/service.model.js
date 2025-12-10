import { Schema, model } from "mongoose";

// === NEW: Package Schema for Catering Services ===
const PackageSchema = new Schema({
  packageName: { type: String, required: true },
  perPlatePrice: { type: Number, required: true },
  minPlates: { type: Number, required: true },
  maxPlates: { type: Number, required: true },
  description: { type: String },
});

const serviceSchema = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    serviceCategory: {
      type: String,
      required: true,
    },
    subCategory: {
      type: [String],
      default: [],
    },
    serviceImage: {
      type: [String],
      required: true,
    },
    minPrice: {
      type: Number,
      required: function () {
        // Required only if NOT catering (or if pricingType is 'flat')
        return !this.pricingType || this.pricingType === "flat";
      },
    },

    // === EXISTING FIELDS - Made conditionally required ===
    maxPrice: {
      type: Number,
      required: function () {
        // Required only if NOT catering (or if pricingType is 'flat')
        return !this.pricingType || this.pricingType === "flat";
      },
    },
    serviceName: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    stateLocationOffered: {
      type: [String],
      required: true,
    },
    locationOffered: {
      type: [String],
      required: true,
    },
    serviceDes: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    customWhyChooseUs: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 5; // Maximum 5 points
        },
        message: 'Cannot have more than 5 "Why Choose Us" points',
      },
    },
    // === NEW FIELDS ADDED (Won't break existing data) ===

    // Pricing type indicator
    pricingType: {
      type: String,
      enum: ["flat", "perPlate"],
      default: "flat", // ✅ All existing services automatically become "flat"
    },

    // Per-plate pricing (Simple Mode) - for Catering
    perPlatePrice: {
      type: Number,
      required: function () {
        // Required if perPlate AND no packages provided
        return (
          this.pricingType === "perPlate" &&
          (!this.packages || this.packages.length === 0)
        );
      },
    },
    minPlates: {
      type: Number,
      required: function () {
        return (
          this.pricingType === "perPlate" &&
          (!this.packages || this.packages.length === 0)
        );
      },
    },
    maxPlates: {
      type: Number,
      required: function () {
        return (
          this.pricingType === "perPlate" &&
          (!this.packages || this.packages.length === 0)
        );
      },
    },

    // Package-based pricing - for Catering
    packages: {
      type: [PackageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// === VALIDATION HOOK (Ensures data integrity) ===
serviceSchema.pre("save", function (next) {
  // For flat pricing - validate minPrice and maxPrice
  if (this.pricingType === "flat") {
    if (!this.minPrice || !this.maxPrice) {
      return next(
        new Error("Min and Max prices are required for non-catering services")
      );
    }
    if (this.minPrice >= this.maxPrice) {
      return next(new Error("Min price must be less than max price"));
    }
  }

  // For per-plate pricing - validate either simple pricing OR packages
  if (this.pricingType === "perPlate") {
    const hasSimplePricing =
      this.perPlatePrice && this.minPlates && this.maxPlates;
    const hasPackages = this.packages && this.packages.length > 0;

    if (!hasSimplePricing && !hasPackages) {
      return next(
        new Error(
          "Catering services must provide either per-plate pricing or packages"
        )
      );
    }

    // Validate simple pricing values if provided
    if (hasSimplePricing) {
      if (
        this.perPlatePrice <= 0 ||
        this.minPlates <= 0 ||
        this.maxPlates <= 0
      ) {
        return next(new Error("Per-plate values must be positive numbers"));
      }
      if (this.minPlates >= this.maxPlates) {
        return next(new Error("Min plates must be less than max plates"));
      }
    }
  }

  next();
});

export const Service = model("Service", serviceSchema);
