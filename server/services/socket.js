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

    // socket.on("join", async (userId, username) => {
    //   socket.join(userId);
    //   console.log(`🔗 User ${username} joined room ${username}`);

    //   await User.findByIdAndUpdate(userId, {
    //     socketId: socket.id,
    //     isOnline: true,
    //   });

    //   const onlineUsers = await User.find({ isOnline: true }, "_id name");
    //   io.emit("online-users", onlineUsers);
    // });

    socket.on("join-chat", async (chatId) => {
      // optional: verify membership before joining
      const chat = await Chat.findById(chatId);
      if (chat && chat.participants.includes(socket.userId)) {
        socket.join(chatId);
      }
    });

    // socket.on("send-message", ({ sender, receiver, ciphertext, createdAt }) => {
    //   // emit exactly the same shape { sender, ciphertext, createdAt }
    //   io.to(receiver).emit("receive-message", {
    //     sender,
    //     ciphertext,
    //     createdAt,
    //   });
    //   socket.emit("receive-message", {
    //     sender,
    //     ciphertext,
    //     createdAt,
    //   });
    // });

    socket.on("send-message", async ({ chatId, iv, ciphertext }) => {
      // persist
      const m = await Message.create({
        chat: chatId,
        sender: socket.userId,
        iv,
        ciphertext,
      });
      // update lastMessage
      await Chat.findByIdAndUpdate(chatId, { lastMessage: m._id });

      // broadcast
      io.to(chatId).emit("receive-message", {
        _id: m._id,
        chat: m.chat,
        sender: m.sender,
        iv: m.iv,
        ciphertext: m.ciphertext,
        createdAt: m.createdAt,
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
