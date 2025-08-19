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
import test_router from "./routes/agenda/agenda.routes.js";
import startAgenda from "./agenda/startAgenda.js";
import "./cronjobs/startCronjobs.js";
import feedbackRoutes from "./routes/common/feedback.routes.js";
import serviceRoutes from "./routes/common/serviceList.routes.js";
import  wishlistRoutes  from "./routes/user/wishlist.routes.js"; // Import wishlist routes
import { searchRouter } from "./routes/common/search.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production"; // ✅ Auto detect

// ✅ Middleware Setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

// ✅ Start Agenda Engine
(async () => {
  try {
    await startAgenda();
  } catch (err) {
    console.error("❌ Agenda init failed:", err);
  }
})();

// ✅ API Routes
app.use("/api/search",searchRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/user", userRouter);
app.use("/api/vendors", vendor_router);
app.use("/api/test", test_router);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/common", serviceRoutes);
app.use("/api/wishlist", wishlistRoutes);// Use wishlist routes
// ✅ Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running and healthy!",
    timestamp: new Date().toISOString(),
    environment: isProduction ? "production" : "development",
  });
});

// ✅ 404 Handler for Unknown API Routes
app.use("/api/*", (req, res) =>
  res.status(404).json({ success: false, message: "API endpoint not found" })
);

// ✅ Error Handler
app.use(errorHandler);

// ✅ Serve Frontend Only in Production (Vite -> dist)
if (isProduction) {
  const frontendPath = path.join(__dirname, "../frontend/dist"); // ✅ Vite output folder

  app.use(express.static(frontendPath));

  // SPA Fallback for non-API routes
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  console.log(
    "💻 Development mode: API only. Frontend served separately on Vite."
  );
}

export { app };
