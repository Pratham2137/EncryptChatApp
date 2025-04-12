import { Server } from "socket.io";
import User from "../models/userModel.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("join", async (userId) => {
      socket.join(userId);
      console.log(`🔗 User ${userId} joined room ${userId}`);

      // Update DB: mark online + store socketId
      await User.findByIdAndUpdate(userId, {
        socketId: socket.id,
        isOnline: true,
      });

      // Optional: Emit online user list to all (UI feature)
      const onlineUsers = await User.find({ isOnline: true }, "_id name");
      io.emit("online-users", onlineUsers);
    });

    socket.on("send-message", ({ sender, receiver, ciphertext }) => {
      console.log(`📨 Message from ${sender} to ${receiver}`);

      // Emit to receiver’s room
      io.to(receiver).emit("receive-message", { sender, ciphertext });
    });

    socket.on("disconnect", async () => {
      console.log("❌ User disconnected:", socket.id);
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        { socketId: null, isOnline: false }
      );

      // Optional: Emit updated online list
      const onlineUsers = await User.find({ isOnline: true }, "_id name");
      io.emit("online-users", onlineUsers);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
