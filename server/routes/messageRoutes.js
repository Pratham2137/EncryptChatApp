// server/routes/messageRoutes.js
import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import { authenticateToken } from "../middlewares/authTokenMiddleware.js";

const router = express.Router();

// Store encrypted message
router.post("/send",authenticateToken, sendMessage);

router.get("/:receiverId", authenticateToken, getMessages);

export default router;
