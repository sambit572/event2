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

// ✅ Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false, // disable strict CSP if using external scripts
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, "build")));

// ✅ API Routes (these come BEFORE SPA fallback)
app.use("/api/reviews", reviewRoutes);
app.use("/api/user", userRouter);
app.use("/api/vendors", vendor_router);

// ✅ Health Check (optional but keep it separate from frontend)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running and healthy!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/*", (req, res) =>
  res.status(404).json({ success: false, message: "API endpoint not found" })
);

// ✅ Error Handler (AFTER routes)
app.use(errorHandler);

// ✅ SPA Fallback: Send index.html for non-API routes
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "build", "index.html"));
});




export { app };
