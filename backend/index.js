console.log("🚀 Initializing server...");

import { config } from "dotenv";
import "dotenv/config";
import cors from "cors";
import { app } from "./app.js";
import { connectToDb } from "./db/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import NegotiationModel from "./model/common/NegotiationModel.js";

config({ path: "./env" });

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 🎯 Handle new negotiation request from customer
  socket.on("new-negotiation-request", async (data) => {
    console.log("📩 Negotiation request received:", data);

    // ✅ Save to DB
    try {
      await NegotiationModel.create({ ...data, status: "pending" });
      console.log("✅ Negotiation request saved to DB");
    } catch (err) {
      console.error("❌ Error saving to DB:", err);
    }

    // 🚀 Emit to all online vendors (real-time)
    io.emit("negotiation_to_vendor", data);
  });

  // 🎯 Handle vendor online - send pending requests from DB
  socket.on("vendor-online", async (vendorName) => {
    try {
      const pendingRequests = await NegotiationModel.find({
        vendorName,
        status: "pending"
      });

      console.log(`📦 Sending ${pendingRequests.length} pending requests to vendor: ${vendorName}`);
      socket.emit("pending-negotiations", pendingRequests);
    } catch (err) {
      console.error("❌ Error fetching pending requests:", err);
    }
  });

    // 🎯 Handle vendor response (accept/decline)
  socket.on("vendor_response", async ({ bookingId, action, vendorName }) => {
  try {
    // ✅ Step 1: Update the status
    await NegotiationModel.findByIdAndUpdate(bookingId, {
      status: action === "accept" ? "accepted" : "declined"
    });

    // ✅ Step 2: Fetch next pending request for same vendor
    const nextPending = await NegotiationModel.findOne({
      vendorName,
      status: "pending"
    }).sort({ createdAt: 1 }); // FIFO queue

    if (nextPending) {
      console.log("📦 Sending next pending request to vendor:", vendorName);
      socket.emit("pending-negotiations", [nextPending]); // sending next one
    }
  } catch (err) {
    console.error("❌ Error handling vendor response:", err);
  }
});


  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Start server after DB connection
const port = process.env.PORT || 8000;

connectToDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(`❌ DB connection failed: ${err}`);
  });
