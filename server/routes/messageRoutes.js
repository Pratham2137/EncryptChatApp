// server/routes/messageRoutes.js
import express from "express";
import { deleteAllMessages, deleteMessages, getMessages, sendMessage } from "../controllers/messageController.js";
import { authenticateToken } from "../middlewares/authTokenMiddleware.js";

const router = express.Router();

// Store encrypted message
router.post("/send",authenticateToken, sendMessage);

router.get("/:receiverId", authenticateToken, getMessages);

// delete a whole conversation
router.delete("/:receiverId", authenticateToken, deleteMessages);

// delete *every* message in your DB
router.delete("/delete/all",authenticateToken, deleteAllMessages);

export default router;
