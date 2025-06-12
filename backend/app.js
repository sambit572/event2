import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running and healthy!",
    timestamp: new Date().toISOString(),
  });
});

import userRouter from "./routes/user.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";

app.use("/user", userRouter);
app.use("/vendors", vendorRoutes);
app.use(errorHandler);

export { app };
