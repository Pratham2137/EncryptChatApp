import express from "express";
import { checkAuth, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/authenticationController.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Refresh access token
router.get("/refresh-token", refreshAccessToken);

// Add this line:
router.post("/logout", logoutUser);

router.get("/check", checkAuth);

export default router;
