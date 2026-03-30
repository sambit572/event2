import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const client = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: false,
  },
});

client.on("error", (err) => {
  console.warn("Redis error:", err.message);
});

(async () => {
  try {
    await client.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.warn("⚠️ Redis unavailable, continuing without cache...");
  }
})();

export default client;