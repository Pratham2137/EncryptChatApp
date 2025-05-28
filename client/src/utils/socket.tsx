// client/utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Connects the socket to the server (once) and joins the given userId room.
 * If already connected, returns the existing socket.
 */
export function connectSocket(userId: string): Socket {
  if (socket && socket.connected) {
    // already connected: no-op (you could re-emit join here if needed)
    return socket;
  }

  // Create a new socket (only WebSocket, with credentials)
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
    auth: { userId },
  });

  // Once, on first successful connect, join the user room
  socket.once("connect", () => {
    console.log("✅ Socket connected:", socket!.id);
    socket!.emit("join", userId);
  });

  socket.on("disconnect", (reason) => {
    console.log("⚠️ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });

  return socket;
}

export function getSocket(): Socket {
  if (!socket) {
    throw new Error("Socket not connected");
  }
  return socket;
}    
