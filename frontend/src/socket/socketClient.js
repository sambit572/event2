import { io } from "socket.io-client";
import { BACKEND_URL } from "../utils/constant";

// ✅ Create socket instance but don't connect immediately
const socket = io(BACKEND_URL, {
  withCredentials: true,
  autoConnect: false, // ✅ Don't connect automatically
  transports: ["websocket", "polling"], // ✅ Allow polling fallback
});

// ✅ Function to connect socket when user logs in
const connectSocket = () => {
  const token = localStorage.getItem("userToken");
  if (token && !socket.connected) {
    socket.auth = { token }; // ✅ Set auth token
    socket.connect();
  }
};

// ✅ Function to disconnect socket when user logs out
const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// ✅ Auto-connect if token exists when module loads
const initializeSocket = () => {
  const token = localStorage.getItem("userToken");
  if (token) {
    connectSocket();
  }
};

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

// ✅ Initialize socket on module load
initializeSocket();

export { connectSocket, disconnectSocket };
export default socket;