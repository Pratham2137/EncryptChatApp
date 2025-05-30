import { Message } from "../models/messageModel.js";
import User from "../models/userModel.js";

export const sendMessage = async (req, res) => {
  const sender = req.user.userId;
  const { receiver, ciphertext } = req.body;

  if (!receiver || !ciphertext) {
    return res
      .status(400)
      .json({ error: "Receiver and ciphertext are required" });
  }

  try {
    // 1) persist message
    const message = await Message.create({ sender, receiver, ciphertext });

    // 2) ensure both users list each other in chats[]
    await User.findByIdAndUpdate(sender, {
      $addToSet: { chats: receiver },
    });
    await User.findByIdAndUpdate(receiver, {
      $addToSet: { chats: sender },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  const userId = req.user.userId;
  const receiverId = req.params.receiverId;
  const receiver = await User.findById(receiverId);

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ createdAt: 1 }); // Oldest to newest

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

export const deleteMessages = async (req, res) => {
  const userId = req.user.userId;
  const receiverId = req.params.receiverId;

  if (!receiverId) {
    return res.status(400).json({ error: "receiverId param is required" });
  }

  try {
    // remove any message where (sender=user & receiver=partner) OR (sender=partner & receiver=user)
    const result = await Message.deleteMany({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    });

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
