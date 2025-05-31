import express from "express";
import Chat from "../models/chatModel.js";
import { authenticateToken } from "../middlewares/authTokenMiddleware.js";

const router = express.Router();

// POST /api/chats
// { partnerId } → returns existing-or-new Chat doc with participants [me, partnerId]
router.post("/", authenticateToken, async (req, res) => {
  const me = req.user.userId;
  const { partnerId } = req.body;
  // find existing
  let chat = await Chat.findOne({
    participants: { $all: [me, partnerId], $size: 2 }
  });
  if (!chat) {
    chat = await Chat.create({ participants: [me, partnerId] });
  }
  res.json(chat);
});

// GET /api/users/chats
// returns all chats you’re in, populated with the other user’s info
router.get("/my", authenticateToken, async (req, res) => {
  const me = req.user.userId;
  const chats = await Chat.find({ participants: me })
    .populate({
      path: "participants",
      select: "_id username avatar publicKey"
    })
    .sort("-updatedAt");
  // remap so each chat has its otherParticipant
  const result = chats.map((c) => {
    const other = c.participants.find((p) => p._id.toString() !== me);
    return {
      chatId: c._id,
      partnerId: other._id,
      partnerName: other.username,
      partnerAvatar: other.avatar,
      partnerPubKey: other.publicKey,
      lastMessage: c.lastMessage,
    };
  });
  res.json({ chats: result });
});

export default router;
