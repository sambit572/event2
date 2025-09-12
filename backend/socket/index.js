import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import registerNegotiationHandler from "./handlers/negotiation.handlers.js";

let io;
let apiNameSpace;
const vendorSocketMap = new Map();

export default function initSocket(server) {
  try {
    io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true, // allow cookies/JWT with socket handshake
      },
    });
    console.log("✅ Socket.IO initialized successfully");
    apiNameSpace = io.of("/api");
  } catch (err) {
    console.error("❌ Failed to initialize Socket.IO:", err);
    throw err; // Stop server if Socket.IO fails
  }

  apiNameSpace.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    try {
      // register your negotiation handlers
      registerNegotiationHandler(apiNameSpace, io, socket, vendorSocketMap);
    } catch (handlerErr) {
      console.error(
        `❌ Failed to register socket handlers for ${socket.id}:`,
        handlerErr
      );
      socket.emit("server_error", {
        message: "Internal server error in socket handler",
      });
    }

    socket.on("disconnect", () => {
      for (let [vendor, id] of vendorSocketMap.entries()) {
        if (id === socket.id) {
          vendorSocketMap.delete(vendor);
          console.log(`⚠ Vendor ${vendor} disconnected`);
          break;
        }
      }
    });

    socket.on("error", (err) => {
      console.error(`⚠️ Socket error on ${socket.id}:`, err);
    });
  });

  // In your backend server code
  io.engine.on("connection_error", (err) => {
    console.log(err.req.headers); // Log the headers to see what's happening

    const purposeHeader =
      err.req.headers["sec-purpose"] || err.req.headers["purpose"];
    if (
      purposeHeader &&
      (purposeHeader.includes("prefetch") ||
        purposeHeader.includes("prerender"))
    ) {
      console.log("Ignoring a prefetch request connection error.");
      return;
    }

    // For any other errors, you can log them as before
    console.error("⚠️ Socket.IO engine connection error:", err);
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

export function getApiNamespace() {
  if (!apiNameSpace) {
    throw new Error("API Namespace not initialized");
  }
  return apiNameSpace;
}
