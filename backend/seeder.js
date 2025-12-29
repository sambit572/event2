// Eventsbridge-Web/backend/seeder.js
import mongoose from "mongoose";

import { Category } from "./model/common/category.model.js";
import "./loadEnv.js";
import { name } from "agenda/dist/agenda/name.js";

// EXACT category names matching your CategoryData.jsx
const categories = [
  {
    name: "DJ Services & Brash Band",
    defaultWhyChooseUs: [
      "Bringing electrifying beats and non-stop energy to light up your celebrations",
      "Backup Equipment Always On-Hand",
      "Experience With All Cultures & Traditions",
      "Custom Packages & Friendly Support",
      "Professional Sound & Lighting Setup",
    ],
  },
  {
    name: "Music Concert & Orchestra",
    defaultWhyChooseUs: [
      "Professional orchestra members",
      "Wide repertoire of musical genres",
      "High-quality sound equipment",
      "Experienced conductors",
      "Customizable performance packages",
    ],
  },
  {
    name: "Decor & Tenthouse", // Note: Your CategoryData uses "Tenthouse" not "Tent House"
    defaultWhyChooseUs: [
      "Modern & traditional decoration themes",
      "High-quality tents & furniture",
      "Custom setups to match your occasion",
      "Professional setup & timely service",
      "Elegant ambience for every event",
    ],
  },
  {
    name: "Photographer & Videographer", // Note: Full name with & symbol
    defaultWhyChooseUs: [
      "Professional photographers & videographers",
      "Latest equipment & technology",
      "Quick delivery of edited content",
      "Candid & traditional photography styles",
      "Drone photography available",
    ],
  },
  {
    name: "Food & Catering",
    defaultWhyChooseUs: [
      "Fresh ingredients & hygienic preparation",
      "Multiple cuisine options available",
      "Professional serving staff",
      "Customizable menu packages",
      "On-time delivery guaranteed",
    ],
  },
  {
    name: "Banquet Hall & Mandap",
    defaultWhyChooseUs: [
      "Spacious halls for large gatherings",
      "Traditional & modern mandap designs",
      "Air-conditioned comfortable spaces",
      "Flexible booking arrangements",
      "Complete venue management services",
    ],
  },
  {
    name: "Classical Music & Dance",
    defaultWhyChooseUs: [
      "Trained classical artists",
      "Authentic traditional performances",
      "Cultural expertise & experience",
      "Professional stage setup",
      "Educational & entertaining programs",
    ],
  },
  {
    name: "Islamic Maulbi", // Exact match
    defaultWhyChooseUs: [
      "Qualified & experienced Islamic scholars",
      "Traditional ceremony guidance",
      "Flexible scheduling arrangements",
      "Respectful & professional service",
      "Complete ritual knowledge",
    ],
  },
  {
    name: "Christian Priest",
    defaultWhyChooseUs: [
      "Ordained & experienced clergy",
      "Traditional & modern ceremony options",
      "Personalized service approach",
      "Professional ceremony guidance",
      "Flexible scheduling availability",
    ],
  },
  {
    name: "Hindu Pandit",
    defaultWhyChooseUs: [
      "Experienced & knowledgeable pandits",
      "Traditional Sanskrit mantras",
      "Complete ritual guidance",
      "Auspicious timing consultation",
      "Professional ceremony conduct",
    ],
  },
  {
    name: "Beauty Makeover",
    defaultWhyChooseUs: [
      "Professional makeup artists",
      "High-quality cosmetic products",
      "Bridal & party makeup expertise",
      "On-location service available",
      "Personalized beauty consultations",
    ],
  },
  {
    name: "Floral Decor", // Changed from "Flower Decor" to match CategoryData
    defaultWhyChooseUs: [
      "Fresh & exotic flower arrangements",
      "Creative & artistic designs",
      "Seasonal flower availability",
      "Custom decoration themes",
      "Timely setup & installation",
    ],
  },
  {
    name: "Ceremonial Ride",
    defaultWhyChooseUs: [
      "Luxury & traditional vehicle options",
      "Professional chauffeur service",
      "Well-maintained & decorated vehicles",
      "Flexible rental packages",
      "On-time pickup & drop service",
    ],
  },
  {
    name: "Luxury Ride",
    defaultWhyChooseUs: [
      "Premium luxury car collection",
      "Experienced & professional chauffeurs",
      "Immaculately maintained vehicles",
      "Comfortable & stylish travel experience",
      "Flexible hourly & full-day packages",
    ],
  },
  {
    name: "Fireworks",
    defaultWhyChooseUs: [
      "Licensed & safe fireworks display",
      "Professional pyrotechnic experts",
      "Spectacular visual effects",
      "Safety compliance guaranteed",
      "Customizable display packages",
    ],
  },
  {
    name: "Card Design & Printing",
    defaultWhyChooseUs: [
      "Creative & unique design options",
      "High-quality printing materials",
      "Fast turnaround delivery",
      "Customizable templates available",
      "Professional design consultation",
    ],
  },
  {
    name: "Magic Shows", // Changed from "Magic Show" to "Magic Shows" (plural)
    defaultWhyChooseUs: [
      "Professional & entertaining magicians",
      "Family-friendly magic shows",
      "Interactive audience participation",
      "Variety of magic performances",
      "Age-appropriate entertainment",
    ],
  },
  {
    name: "Stage Decor",
    defaultWhyChooseUs: [
      "Professional stage design & setup",
      "Creative & thematic decorations",
      "High-quality backdrop materials",
      "Lighting & sound integration",
      "Timely installation & dismantling",
    ],
  },
  {
    name: "Event Company",
    defaultWhyChooseUs: [
      "Complete event planning & management",
      "Experienced & creative team",
      "Customized packages for all budgets",
      "One-stop solution for all event needs",
      "Hassle-free, professional execution",
    ],
  },
  {
    name: "Balloon Decor",
    defaultWhyChooseUs: [
      "Beautiful & customizable balloon themes",
      "Affordable decoration packages",
      "Unique designs for any celebration",
      "Professional installation team",
      "High-quality balloons & safe materials",
    ],
  },
  {
  name: "Hotel & Resorts",
  defaultWhyChooseUs: [
    "Wide range of hotels & resorts to suit every budget",
    "Premium locations with modern amenities",
    "Comfortable rooms with exceptional hospitality",
    "Ideal venues for weddings, events & business stays",
    "Verified properties with reliable service standards",
  ],
},

];

const seedCategories = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");

    for (const categoryData of categories) {
      await Category.findOneAndUpdate(
        { name: categoryData.name },
        { $set: { defaultWhyChooseUs: categoryData.defaultWhyChooseUs } },
        { upsert: true, new: true }
      );
      console.log(`✅ Category "${categoryData.name}" has been seeded.`);
    }

    console.log("\n🎉 All categories have been seeded successfully!");
  } catch (error) {
    console.error(`❌ Error seeding data: ${error.message}`);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB Connection Closed.");
  }
};

seedCategories();
