import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import { fileURLToPath } from "url";

import userRouter from "./routes/user/user.routes.js";
import { vendor_router } from "./routes/vendor/vendor.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production"; // ✅ Detect environment

// ✅ Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ API Routes
app.use("/api/reviews", reviewRoutes);
app.use("/api/user", userRouter);
app.use("/api/vendors", vendor_router);

// ✅ Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running and healthy!",
    environment: isProduction ? "production" : "development",
    timestamp: new Date().toISOString(),
  });
});

// ✅ 404 Handler for Unknown API Routes
app.use("/api/*", (req, res) =>
  res.status(404).json({ success: false, message: "API endpoint not found" })
);

// ✅ Error Handler (AFTER routes)
app.use(errorHandler);

// ✅ Serve Vite build only in Production
if (isProduction) {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // SPA Fallback for non-API routes
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

export { app };
