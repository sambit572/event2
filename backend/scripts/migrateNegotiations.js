// backend/scripts/migrateNegotiations.js
// Run this once to add default null values for new catering fields

import mongoose from "mongoose";
import { Negotiation } from "../model/common/Negotiation.model.js";
import dotenv from "dotenv";

dotenv.config();

const migrateNegotiations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Update all existing negotiations to add new catering fields
    const result = await Negotiation.updateMany(
      {
        // Only update documents that don't have these fields
        packageName: { $exists: false },
      },
      {
        $set: {
          packageName: null,
          plateCount: null,
          pricePerPlate: null,
          totalPrice: null,
        },
      }
    );

    console.log(`✅ Migration completed!`);
    console.log(`   Modified ${result.modifiedCount} documents`);
    console.log(`   Matched ${result.matchedCount} documents`);

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

// Run migration
migrateNegotiations();
