import "./loadEnv.js";

// ✅ Import required modules
import client, { connectRedis } from "./db/redisClient.js";
import { app } from "./app.js";
import { connectToDb } from "./db/db.js";
import mongoose from "mongoose";
import { createServer } from "http";
import initSocket from "./socket/index.js";

let server;
let io;

try {
  server = createServer(app);
  console.log("✅ HTTP server created successfully");
} catch (err) {
  console.error("❌ Failed to create HTTP server:", err);
  process.exit(1);
}

try {
  io = initSocket(server);
  console.log("✅ Socket.IO initialized successfully");
} catch (err) {
  console.error("❌ Socket initialization failed:", err);
  process.exit(1);
}

const port = process.env.PORT || 8000;

// ✅ Start app properly
const startServer = async () => {
  try {
    // 1️⃣ Connect Redis safely
    await connectRedis();

    // 2️⃣ Connect MongoDB
    await connectToDb();

    // ❌ DO NOT flush all Redis in production
    // await client.flushAll();

    server.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
};

startServer();

// ✅ Handle unexpected async errors
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
  closeServer();
});

// ✅ Handle runtime crashes
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  closeServer();
});

// ✅ Graceful shutdown on signals
process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);

// ✅ Graceful shutdown helper
async function closeServer() {
  console.log("🛑 Shutting down server gracefully...");

  try {
    // 1️⃣ Close HTTP server
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("✅ HTTP server closed.");
    }

    // 2️⃣ Close Socket.IO
    if (io) {
      await new Promise((resolve) => io.close(resolve));
      console.log("✅ Socket.IO closed.");
    }

    // 3️⃣ Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close(false);
      console.log("✅ MongoDB connection closed.");
    }

    // 4️⃣ Close Redis connection
    if (client?.isOpen) {
      await client.quit();
      console.log("✅ Redis connection closed.");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error during graceful shutdown:", err);
    process.exit(1);
  }
}