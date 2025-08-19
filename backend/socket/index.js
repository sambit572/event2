import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import registerNegotiationHandler from "./handlers/negotiation.handlers.js";

let ioInstance = null;

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("❌ Socket.IO not initialized");
  }
  return ioInstance;
};

export default function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // ✅ ADD THIS MIDDLEWARE: The "Check-in" Process
  io.use((socket, next) => {
    // Your frontend sends the token in socket.handshake.auth
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: Token not provided"));
    }

    // Verify the token to get the user's ID
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token"));
      }
      // Attach the user ID to the socket object for later use
      socket.userId = decoded._id;
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id} with UserID: ${socket.userId}`);

    // ✅ JOIN THE ROOM: Put the user in their private room
    socket.join(socket.userId);

    // Your other handlers
    registerNegotiationHandler(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`🔴 User disconnected: ${socket.id} (Reason: ${reason})`);
    });

    socket.on("error", (err) => {
      console.error(`⚠️ Socket error on ${socket.id}:`, err);
    });
  });

  ioInstance = io;
  return io;
}