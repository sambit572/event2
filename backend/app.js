import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url"; // Required for __dirname in ES modules

// Import your custom middleware
import { errorHandler } from "./middleware/error.middleware.js";

// Import your routes
import userRouter from "./routes/user.routes.js";
import vendorRoutes from "./routes/vendor.routes.js"; // Assuming you have this file for vendor-related routes

const app = express();

// --- Configuration for ES Modules (to get __dirname equivalent) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---

// CORS Configuration: Allows specific origins, credentials, headers, and methods
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Body Parsers: Parses incoming request bodies
app.use(express.json({ limit: "16kb" })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Handle URL-encoded data

// Static Files: Serve static files from the 'public' directory
app.use(express.static("public"));

// Cookie Parser: Parses cookies attached to the client request object
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





// Health Check Route: Simple route to check if the server is running
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running and healthy!',
    timestamp: new Date().toISOString()
  });
});

// User Routes: Handles all user-related API endpoints
app.use("/user", userRouter);


app.use("/api/vendors", vendorRoutes);

app.use(errorHandler);


export { app }; // Exporting app for testing or other uses
