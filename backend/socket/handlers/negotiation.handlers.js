import NegotiationModel from "../../model/common/NegotiationModel.js";

export default function registerNegotiationHandler(io, socket) {
  // 🎯 Handle new negotiation request from customer
  socket.on("new-negotiation-request", async (data) => {
    console.log("📩 Negotiation request received:", data);

    try {
      await NegotiationModel.create({ ...data, status: "pending" });
      console.log("✅ Negotiation request saved to DB");
    } catch (err) {
      console.error("❌ Error saving to DB:", err);
    }

    io.emit("negotiation_to_vendor", data);
  });

  // 🎯 Handle vendor coming online
  socket.on("vendor-online", async (vendorName) => {
    try {
      const pendingRequests = await NegotiationModel.find({
        vendorName,
        status: "pending",
      });

      console.log(
        `📦 Sending ${pendingRequests.length} pending requests to vendor: ${vendorName}`
      );
      socket.emit("pending-negotiations", pendingRequests);
    } catch (err) {
      console.error("❌ Error fetching pending requests:", err);
    }
  });

  // 🎯 Handle vendor response (accept/decline)
  socket.on("vendor_response", async ({ bookingId, action, vendorName }) => {
    try {
      await NegotiationModel.findByIdAndUpdate(bookingId, {
        status: action === "accept" ? "accepted" : "declined",
      });

      const nextPending = await NegotiationModel.findOne({
        vendorName,
        status: "pending",
      }).sort({ createdAt: 1 });

      if (nextPending) {
        console.log("📦 Sending next pending request to vendor:", vendorName);
        socket.emit("pending-negotiations", [nextPending]);
      }
    } catch (err) {
      console.error("❌ Error handling vendor response:", err);
    }
  });
}
