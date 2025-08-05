import { Server } from "socket.io";
import registerNegotiationHandler from "./handlers/negotiation.handlers.js";

export default function initSocket(server) {
  let io;
  try {
    io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      },
    });
    console.log("✅ Socket.IO initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize Socket.IO:", err);
    throw err; // Critical failure, bubble up to stop server startup
  }

  io.on("connection", (socket) => {
    try {
      console.log("🟢 User connected:", socket.id);

      // ✅ Wrap handler registration in try-catch
      try {
        registerNegotiationHandler(io, socket);
      } catch (handlerErr) {
        console.error(
          `❌ Failed to register socket handlers for ${socket.id}:`,
          handlerErr
        );
        socket.emit("server_error", {
          message: "Internal server error in socket handler",
        });
      }

      socket.on("disconnect", (reason) => {
        console.log(`🔴 User disconnected: ${socket.id} (Reason: ${reason})`);
      });

      // Catch unexpected socket errors
      socket.on("error", (err) => {
        console.error(`⚠️ Socket error on ${socket.id}:`, err);
      });
    } catch (err) {
      console.error("❌ Error during socket connection setup:", err);
    }
  });

  // Optional: Handle IO-level errors (e.g., adapter failures)
  io.engine.on("connection_error", (err) => {
    console.error("⚠️ Socket.IO engine connection error:", err);
  });

  return io;
}
