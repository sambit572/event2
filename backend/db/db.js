import mongoose from "mongoose";

export const connectToDb = async () => {
  const mongoUri = process.env.MONGODB_URL;
  if (!mongoUri) {
    console.error("❌ MONGODB_URL not found in environment variables.");
    process.exit(1);
  }

  try {
    console.log("Trying to connect to MongoDB Atlas...");
    const connectionInstance = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `✅ MongoDB connected on ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔌 MongoDB disconnected due to app termination");
    process.exit(0);
  });
};
