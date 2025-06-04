import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectToDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    if (connectionInstance) {
      console.log(`db is connected on ${connectionInstance.connection.host}`);
    }
  } catch (error) {
    console.log("error in connection:", error);
    process.exit(1)
  }
};
