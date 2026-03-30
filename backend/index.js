import "./loadEnv.js";

// Import required modules
import client from "./db/redisClient.js";
import { app } from "./app.js";
import { connectToDb } from "./db/db.js";
import mongoose from "mongoose"; // Import mongoose for DB close
import { createServer } from "http";
import initSocket from "./socket/index.js";

let server;
try {
  server = createServer(app);
  console.log("HTTP server created successfully");
} catch (err) {
  console.error("Failed to create HTTP server:", err);
  process.exit(1);
}

let io;
try {
  io = initSocket(server); // Store io for cleanup
  console.log("Socket.IO initialized successfully");
} catch (err) {
  console.error("Socket initialization failed:", err);
  process.exit(1);
}

const port = process.env.PORT || 8000;   // ← you can keep 8001 if you want

// Connect to DB and start server
connectToDb()
  .then(async () => {
    // ==================== UPDATED PART (Safe Redis check) ====================
    if (client.isReady) {
      try {
        await client.flushAll();
        console.log("✅ All cached data cleared on server restart.");
      } catch (err) {
        console.warn("⚠️ Failed to clear cache on startup:", err.message);
      }
    } else {
      console.warn("⚠️ Redis not connected, skipping cache clear");
    }
    // =========================================================================

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(`DB connection failed: ${err}`);
    process.exit(1);
  });

// Handle unexpected async errors
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
  closeServer();
});

// Handle runtime crashes
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  closeServer();
});

// Graceful shutdown on signals (e.g., Ctrl+C, Kubernetes stop)
process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);

// Graceful shutdown helper
async function closeServer() {
  console.log("Shutting down server gracefully...");

  try {
    // 1. Close HTTP server
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("HTTP server closed.");
    }

    // 2. Close Socket.IO
    if (io) {
      await new Promise((resolve) => io.close(resolve));
      console.log("Socket.IO closed.");
    }

    // 3. Close DB connection
    if (mongoose.connection.readyState === 1) {
      // connected
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed.");
    }

    process.exit(0); // Normal exit
  } catch (err) {
    console.error("Error during graceful shutdown:", err);
    process.exit(1);
  }
}