// server/routes/messageRoutes.js
import express from "express";
import { deleteAllMessages, deleteChatMessages, getMessagesByChat, postMessageToChat } from "../controllers/messageController.js";
import { authenticateToken } from "../middlewares/authTokenMiddleware.js";

const router = express.Router();

// // Store encrypted message
// router.post("/send",authenticateToken, sendMessage);

// router.get("/:receiverId", authenticateToken, getMessages);

// // delete a whole conversation
// router.delete("/:receiverId", authenticateToken, deleteMessages);

// POST   /api/chats/:chatId/messages
router.post("/:chatId/messages", authenticateToken, postMessageToChat);
// GET    /api/chats/:chatId/messages
router.get("/:chatId/messages", authenticateToken, getMessagesByChat);

-// delete a whole conversation
// -router.delete("/:receiverId", authenticateToken, deleteMessages);


// DELETE /api/chats/:chatId/messages
router.delete("/:chatId/messages", authenticateToken, deleteChatMessages);

// delete *every* message in your DB
router.delete("/delete/all",authenticateToken, deleteAllMessages);

export default router;
