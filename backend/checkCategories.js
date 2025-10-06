import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { Category } from "./model/common/category.model.js";

// Load environment variables with explicit path
dotenv.config({ path: path.resolve('.env') });

// Debug: Check if MONGODB_URL is loaded
console.log("MONGODB_URL loaded:", process.env.MONGODB_URL ? "Yes" : "No");
if (!process.env.MONGODB_URL) {
  console.error("❌ MONGODB_URL not found in environment variables");
  console.log("Available env variables:", Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('DB')));
  process.exit(1);
}

const checkCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected...");
    
    const categories = await Category.find({});
    console.log("\n📋 Categories in Database:");
    console.log("=".repeat(50));
    
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. "${cat.name}"`);
      console.log(`   Default Points: ${cat.defaultWhyChooseUs?.length || 0} points`);
      
      if (cat.defaultWhyChooseUs && cat.defaultWhyChooseUs.length > 0) {
        cat.defaultWhyChooseUs.forEach((point, i) => {
          console.log(`     ${i + 1}) ${point}`);
        });
      } else {
        console.log(`   ❌ NO DEFAULT POINTS SET`);
      }
      console.log("");
    });
    
    console.log(`\n✅ Total Categories: ${categories.length}`);
    
    // Also check for the specific category that's failing
    const specificCategory = await Category.findOne({ 
      name: "DJ Services & Brash Band" 
    });
    
    console.log("\n🔍 Specific Category Check:");
    if (specificCategory) {
      console.log(`✅ Found: "${specificCategory.name}"`);
      console.log(`   Points: ${specificCategory.defaultWhyChooseUs?.length || 0}`);
    } else {
      console.log(`❌ "DJ Services & Brash Band" not found`);
      
      // Check for similar names
      const similarCategories = await Category.find({
        name: { $regex: "DJ", $options: "i" }
      });
      console.log(`   Similar categories found: ${similarCategories.length}`);
      similarCategories.forEach(cat => {
        console.log(`   - "${cat.name}"`);
      });
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  } finally {
    mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  }
};

checkCategories();