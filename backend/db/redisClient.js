import { createClient } from "redis";

const client = createClient({
  url: "redis://127.0.0.1:6379",
  socket: {
    reconnectStrategy: false,
  },
});

client.on("error", () => {});

try {
  await client.connect();
  console.log("✅ Redis connected");
} catch (err) {
  console.warn("⚠️ Redis unavailable, continuing without cache...");
}

export default client;
