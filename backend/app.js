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

// Serve static files for uploaded content (e.g., images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vendor-management', {
 
})
.then(() => {
  console.log('Connected to MongoDB successfully!');
})
.catch((error) => {
  console.error('MongoDB connection error:', error.message);
  process.exit(1);
});


// --- Routes ---

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

// Vendor Routes: Handles all vendor-related API endpoints
// This assumes you have a `vendor.routes.js` file exporting its routes
app.use("/api/vendors", vendorRoutes);

// --- Error Handling Middleware ---
// This middleware should be the last one in your app.js to catch all errors
app.use(errorHandler);


// --- Server Start ---
// Define the port for the server to listen on, defaulting to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access health check at: http://localhost:${PORT}/`);
  console.log(`Frontend URL for CORS: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export { app }; // Exporting app for testing or other uses
