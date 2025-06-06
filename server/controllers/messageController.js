import { Message } from "../models/messageModel.js";
import User from "../models/userModel.js";

export const sendMessage = async (req, res) => {
  const sender = req.user.userId;
  const { receiver, iv, ciphertext, createdAt } = req.body;

  if (!receiver || !iv || !ciphertext) {
    return res
      .status(400)
      .json({ error: "Receiver, IV, and ciphertext are required" });
  }

  try {
    // 1) persist message
    const message = await Message.create({
      sender,
      receiver,
      ciphertext, // assumed to be Base64
      iv, // assumed to be Base64
      createdAt, // from client’s timestamp
    });

    // 2) ensure both users list each other in chats[]
    await User.findByIdAndUpdate(sender, {
      $addToSet: { chats: receiver },
    });
    await User.findByIdAndUpdate(receiver, {
      $addToSet: { chats: sender },
    });

    // console.log("Message sent:", message);
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  const userId = req.user.userId;
  const receiverId = req.params.receiverId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    })
      .select("_id sender ciphertext iv createdAt")
      .sort({ createdAt: 1 });

    // Now each `msg` has { _id, sender, ciphertext, iv, createdAt }
    // console.log("Fetched messages:", messages);
    return res.status(200).json(messages);
  } catch (err) {
    console.error("Failed to fetch messages", err);
    return res.status(500).json({ message: "Failed to retrieve messages" });
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
