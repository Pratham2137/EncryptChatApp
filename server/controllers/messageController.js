import Chat from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import User from "../models/userModel.js";

export const postMessageToChat = async (req, res) => {
  const sender = req.user.userId;
  const { chatId } = req.params;
  const { iv, ciphertext } = req.body;

  if (!iv || !ciphertext) {
    return res.status(400).json({ error: "iv and ciphertext are required" });
  }

  try {
    // 1) verify chat exists and user is participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.some((p) => p.toString() === sender)) {
      return res
        .status(403)
        .json({ error: "Invalid chatId or not a participant" });
    }
    // 2) persist encrypted message
    const message = await Message.create({
      chat: chatId,
      sender,
      iv,
      ciphertext,
    });
    // 3) update lastMessage pointer (optional)
    chat.lastMessage = message._id;
    await chat.save();

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessagesByChat = async (req, res) => {
  const userId = req.user.userId;
  const { chatId } = req.params;

  // verify chat and membership
  const chat = await Chat.findById(chatId);
  if (!chat || !chat.participants.some((p) => p.toString() === userId)) {
    return res
      .status(403)
      .json({ error: "Invalid chatId or not a participant" });
  }

  try {
    const messages = await Message.find({ chat: chatId }).sort("createdAt");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

export const deleteChatMessages = async (req, res) => {
  const userId = req.user.userId;
  const { chatId } = req.params;

  // verify chat and membership as above
  const chat = await Chat.findById(chatId);
  if (!chat || !chat.participants.some((p) => p.toString() === userId)) {
    return res
      .status(403)
      .json({ error: "Invalid chatId or not a participant" });
  }

  try {
    const result = await Message.deleteMany({ chat: chatId });

    return res.status(200).json({
      deletedCount: result.deletedCount,
      message: "Conversation cleared.",
    });
  } catch (err) {
    console.error("Failed to delete messages:", err);
    return res.status(500).json({ error: "Failed to delete messages" });
  }
};

export const deleteAllMessages = async (req, res) => {
  try {
    const result = await Message.deleteMany({});
    return res.status(200).json({
      deletedCount: result.deletedCount,
      message: "All messages have been deleted.",
    });
  } catch (err) {
    console.error("Failed to delete all messages:", err);
    return res.status(500).json({ error: "Failed to delete all messages" });
  }
};
