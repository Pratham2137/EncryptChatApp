import { Message } from "../models/messageModel.js";
import User from "../models/userModel.js";

export const sendMessage = async (req, res) => {
  const sender = req.user.userId;
  const receiver = req.body.receiver;
  const ciphertext = req.body.ciphertext ?? req.body.text;

  if (!receiver || !ciphertext) {
    return res
      .status(400)
      .json({ error: "Receiver and ciphertext are required" });
  }

  try {
    const message = await Message.create({ sender, receiver, ciphertext });
    res.status(201).json(message);
  } catch (error) {
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
