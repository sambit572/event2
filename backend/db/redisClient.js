import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`🔄 Redis reconnect attempt #${retries}`);
      return Math.min(retries * 100, 3000); // retry delay max 3s
    },
    keepAlive: 5000,
  },
});

client.on("connect", () => {
  console.log("🔌 Redis connecting...");
});

client.on("ready", () => {
  console.log("✅ Redis ready");
});

client.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

client.on("end", () => {
  console.warn("⚠️ Redis connection closed");
});

client.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

export const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
      console.log("✅ Redis connected successfully");
    }
  } catch (error) {
    console.error("❌ Failed to connect Redis:", error.message);
  }
};

export default client;