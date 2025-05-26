import {io} from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL);

socket.on("connect", ()=>{
    console.log("Connected to the server");
});

socket.on("disconnect", ()=>{
    console.log("Disconnected from server.");
});

export default socket;



// import { io } from "socket.io-client";

// const socket = io(import.meta.env.VITE_SOCKET_URL, {
//   withCredentials: true,
//   autoConnect: false, // You should manually connect after auth
//   transports: ["websocket"], // Use only WebSocket transport for real-time messaging
//   reconnectionAttempts: 5, // Retry connection 5 times
// });

// socket.on("connect", () => {
//   console.log("✅ Connected to WhisprNet server");
// });

// socket.on("disconnect", () => {
//   console.log("⚠️ Disconnected from WhisprNet server");
// });

// socket.on("connect_error", (err) => {
//   console.error("❌ Connection error:", err.message);
// });

// export default socket;
