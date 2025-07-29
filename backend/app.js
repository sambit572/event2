import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user/user.routes.js";
import { vendor_router } from "./routes/vendor/vendor.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import reviewRoutes from "./routes/review.routes.js";
import test_router from "./routes/agenda/agenda.routes.js";
import startAgenda from "./agenda/startAgenda.js";
import "./cronjobs/startCronjobs.js";
import feedbackRoutes from "./routes/common/feedback.routes.js";

const app = express();

// ✅ Set up all middleware BEFORE the routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.static("public")); 
app.use(express.json()); // ✅ Important
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// use to start Agenda engine
(async () => {
  try {
    await startAgenda();
  } catch (err) {
    console.error("❌ Agenda init failed:", err);
  }
})();



app.use("/api/reviews", reviewRoutes);
// ✅ Now register your routes
app.use("/user", userRouter);
app.use("/vendors", vendor_router);

app.use("/test", test_router);


// ✅ Register your feedback route
app.use("/feedback", feedbackRoutes);

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
