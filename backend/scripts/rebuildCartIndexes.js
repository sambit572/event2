// backend/scripts/rebuildCartIndexes.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, "../.env") });

const rebuildCartIndexes = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    console.log(
      "📍 Database:",
      process.env.MONGODB_URL ? "Found in .env" : "⚠️  NOT FOUND"
    );

    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URI not found in .env file");
    }

    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB successfully!");

    const Cart = mongoose.connection.collection("carts");

    console.log("\n📋 Fetching existing indexes...");
    const existingIndexes = await Cart.indexes();
    console.log(
      "Current indexes:",
      existingIndexes.map((i) => i.name)
    );

    console.log("\n🗑️  Dropping old indexes...");

    // Drop all indexes except _id
    for (const index of existingIndexes) {
      if (index.name !== "_id_") {
        try {
          await Cart.dropIndex(index.name);
          console.log(`✅ Dropped index: ${index.name}`);
        } catch (err) {
          console.log(`⚠️  Could not drop ${index.name}:`, err.message);
        }
      }
    }

    console.log("\n🔨 Creating new indexes...");

    // Index 1: For regular services (non-catering)
    await Cart.createIndex(
      { userId: 1, serviceId: 1, isCateringService: 1 },
      {
        unique: true,
        name: "userId_serviceId_nonCatering_unique",
        partialFilterExpression: { isCateringService: false },
      }
    );
    console.log("✅ Created index: userId_serviceId_nonCatering_unique");

    // Index 2: For catering packages (allows multiple from same service)
    await Cart.createIndex(
      { userId: 1, serviceId: 1, "cateringDetails.packageName": 1 },
      {
        unique: true,
        name: "userId_serviceId_packageName_unique",
        partialFilterExpression: { isCateringService: true },
      }
    );
    console.log("✅ Created index: userId_serviceId_packageName_unique");

    // Index 3: For query performance
    await Cart.createIndex(
      { userId: 1, createdAt: -1 },
      { name: "userId_createdAt" }
    );
    console.log("✅ Created index: userId_createdAt");

    console.log("\n✅ All indexes rebuilt successfully!");

    // Verify
    console.log("\n📋 Verifying new indexes:");
    const newIndexes = await Cart.indexes();
    newIndexes.forEach((idx) => {
      console.log(`  ✓ ${idx.name}`);
      if (idx.partialFilterExpression) {
        console.log(
          `    └─ Partial filter: ${JSON.stringify(
            idx.partialFilterExpression
          )}`
        );
      }
    });

    await mongoose.connection.close();
    console.log("\n🔒 Database connection closed.");
    console.log("🎉 Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error rebuilding indexes:", error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

console.log("🚀 Starting Cart Indexes Migration...\n");
rebuildCartIndexes();
