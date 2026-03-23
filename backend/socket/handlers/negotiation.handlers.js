// registerNegotiationHandler.js
import { Negotiation } from "../../model/common/Negotiation.model.js";

export default async function registerNegotiationHandler(
  apiNameSpace,
  io,
  socket,
  vendorSocketMap
) {
  // 🎯 Handle new negotiation request from customer
  socket.on("new-negotiation-request", async (data) => {
    console.log("📩 Negotiation request received:", data);

    try {
      // Save to DB with vendorDecision as pending
      const res = await Negotiation.create({
        ...data,
        vendorDecision: "pending",
      });

      console.log("✅ Negotiation request saved to DB:", res);

      // If vendor is online, send directly
      const vendorSocketId = vendorSocketMap.get(data.vendorId);
      if (vendorSocketId) {
        console.log(`📤 Sending negotiation to vendor: ${data.vendorId}`);
        apiNameSpace.to(vendorSocketId).emit("negotiation_to_vendor", res);
      } else {
        console.log(`⚠ Vendor ${data.vendorId} offline, stored for later.`);
      }
    } catch (err) {
      console.error("❌ Error handling negotiation:", err);
    }
  });

  // 🎯 Handle vendor coming online
  socket.on("vendor-online", async (vendorId) => {
    vendorSocketMap.set(vendorId, socket.id);
    console.log(`✅ Vendor ${vendorId} online with socket ID: ${socket.id}`);

    try {
      const pendingRequests = await Negotiation.find({
        vendorId,
        vendorDecision: "pending",
      });

      console.log("✅ Fetched pending requests:", pendingRequests);

      console.log(
        `📦 Sending ${pendingRequests.length} pending requests to vendor: ${vendorId}`
      );

      if (pendingRequests.length > 0) {
        socket.emit("pending-negotiations", pendingRequests);
      }
    } catch (err) {
      console.error("❌ Error fetching pending requests:", err);
    }
  });

  // 🎯 Handle vendor response (accept/decline)
  socket.on(
    "vendor_response",
    async ({ vendorId, bookedByUserId, serviceId, action, finalPrice }) => {
      try {
        // Find the current negotiation using composite identity
        const negotiation = await Negotiation.findOneAndUpdate(
          {
            vendorId,
            bookedByUserId,
            serviceId,
            vendorDecision: "pending", // prevent updating old records
          },
          {
            vendorDecision: action === "accept" ? "accepted" : "rejected",
            ...(finalPrice !== undefined && { finalPrice }),
          },
          { new: true }
        );

        if (!negotiation) {
          console.log("❌ No matching negotiation found for vendor_response");
          return;
        }

        console.log("✅ Vendor response saved:", negotiation);

        // Send next pending negotiation for this vendor
        const nextPending = await Negotiation.findOne({
          vendorId,
          vendorDecision: "pending",
        }).sort({ createdAt: 1 });

        if (nextPending) {
          console.log(
            "📦 Sending next pending negotiation to vendor:",
            vendorId
          );
          socket.emit("pending-negotiations", [nextPending]);
        }
      } catch (err) {
        console.error("❌ Error handling vendor response:", err);
      }
    }
  );

  // 🎯 Clean up mapping when vendor disconnects
  socket.on("disconnect", () => {
    for (let [id, sockId] of vendorSocketMap.entries()) {
      if (sockId === socket.id) {
        vendorSocketMap.delete(id);
        console.log(`🛑 Vendor ${id} disconnected`);
        break;
      }
    }
  });
}
