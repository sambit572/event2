import { io } from "socket.io-client";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

console.log("Connecting to Socket.IO at:", BACKEND);

const socket = io(BACKEND, {
  withCredentials: true,
  transports: ["websocket"],
  forceNew: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connect_error:", err);
  if (err.message === "Session ID unknown") {
    console.log("Stale session ID detected. Forcing a new connection.");
    socket.disconnect();
    socket.connect();
  }
});

socket.on("reconnect_attempt", (attempt) => {
  console.log("Socket reconnect attempt:", attempt);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

export default socket;
