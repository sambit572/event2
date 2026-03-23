import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import { fileURLToPath } from "url";

import client from "./db/redisClient.js";
import userRouter from "./routes/user/user.routes.js";
import { vendor_router } from "./routes/vendor/vendor.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import reviewRoutes from "./routes/common/review.routes.js";
import test_router from "./routes/agenda/agenda.routes.js";
import startAgenda from "./agenda/startAgenda.js";
import "./cronjobs/startCronjobs.js";
import feedbackRoutes from "./routes/common/feedback.routes.js";
import serviceRoutes from "./routes/common/serviceList.routes.js";
import reportRoutes from "./routes/common/report.routes.js";
import wishlistRoutes from "./routes/user/wishlist.routes.js"; // Import wishlist routes
import cartRouter from "./routes/user/cart.routes.js";
import { searchRouter } from "./routes/common/search.routes.js";
import calendarRoutes from "./routes/common/calendar.routes.js";
import userBookingHistoryRoutes from "./routes/user/userBookinghistory.routes.js";

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

app.use(express.json({ limit: "1024mb" }));
app.use(express.urlencoded({ limit: "1024mb", extended: true }));
app.use(cookieParser());

// ✅ Start Agenda Engine
(async () => {
  try {
    await startAgenda();
  } catch (err) {
    console.error("❌ Agenda init failed:", err);
  }
})();
//rads api for testing
// Cached API with Redis
app.get("/api/slow-api", async (req, res) => {
  const cacheKey = "user:data";

  // 1. Check Redis first
  const cached = await client.get(cacheKey);

  if (cached) {
    return res.json({ source: "cache", data: JSON.parse(cached) });
  }

  // 2. If not in cache → simulate slow API (5 sec)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const data = {
    name: "Rahul Yadav",
    role: "Developer",
    time: new Date().toISOString(),
  };

  // 3. Save in Redis for future (set expiry 30 sec)
  await client.setEx(cacheKey, 30, JSON.stringify(data));

  res.json({ source: "API", data });
});

// ✅ API Routes
app.use("/api/reports", reportRoutes);
app.use("/api/search", searchRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/user", userRouter);
app.use("/api/vendors", vendor_router);
app.use("/api/test", test_router);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/common", serviceRoutes);
app.use("/api/wishlist", wishlistRoutes); // Use wishlist routes
app.use("/api/cart", cartRouter);
app.use("/api/calendar", calendarRoutes);
app.use("/api/user-bookings", userBookingHistoryRoutes);

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
