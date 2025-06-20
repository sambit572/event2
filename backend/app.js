import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user/user.routes.js";
import { vendor_router } from "./routes/vendor/vendor.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// ✅ Set up all middleware BEFORE the routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.static("public"));
app.use(express.json()); // ✅ Important
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Now register your routes
app.use("/user", userRouter);
app.use("/vendors", vendor_router);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running and healthy!",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Finally register the error handler
app.use(errorHandler);

export { app };
