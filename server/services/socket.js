// server/utils/socket.js
import { Server } from "socket.io";
import User from "../models/userModel.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true, // ← must allow credentials for withCredentials
    },
    transports: ["websocket"], // optional: only websocket
  });

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("join", async (userId, username) => {
      socket.join(userId);
      console.log(`🔗 User ${username} joined room ${username}`);

      await User.findByIdAndUpdate(userId, {
        socketId: socket.id,
        isOnline: true,
      });

      const onlineUsers = await User.find({ isOnline: true }, "_id name");
      io.emit("online-users", onlineUsers);
    });

    socket.on("send-message", ({ sender, receiver, ciphertext, createdAt }) => {
      // emit exactly the same shape { sender, ciphertext, createdAt }
      io.to(receiver).emit("receive-message", {
        sender,
        ciphertext,
        createdAt,
      });
      socket.emit("receive-message", {
        sender,
        ciphertext,
        createdAt,
      });
    });

    socket.on("disconnect", async (reason) => {
      console.log("❌ User disconnected:", socket.id, reason);
      await User.findOneAndUpdate(
        { socketId: socket.id },
        { socketId: null, isOnline: false }
      );
      const onlineUsers = await User.find({ isOnline: true }, "_id name");
      io.emit("online-users", onlineUsers);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
