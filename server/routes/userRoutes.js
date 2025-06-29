import express from "express";
import {
  addContact,
  fetchUserProfile,
  findUser,
  getAllUsers,
  getChats,
  getContacts,
  getEncryptedPrivateKey,
  getGroups,
  getPublicKey,
  removeContact,
  searchUsers,
  setEncryptedPrivateKey,
  setPublicKey,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authTokenMiddleware.js";

const router = express.Router();

//get all users
router.get("/getAllUsers", authenticateToken, getAllUsers);

//auth token test route
router.get("/profile", authenticateToken, fetchUserProfile);

// find user by email and username
router.get("/find", authenticateToken, findUser);

//find users excluding current user and friends
router.get("/search", authenticateToken, searchUsers);

// Store the authenticated user’s ECDH public key
router.post("/public-key", authenticateToken, setPublicKey);

// Retrieve another user’s public key by their userId
router.get("/public-key/:userId", authenticateToken, getPublicKey);

// Store the user’s encrypted PRIVATE key under AES-GCM.
// Payload: { iv: string, ciphertext: string }
router.post("/encrypted-private", authenticateToken, setEncryptedPrivateKey);

// Retrieve another user’s encrypted PRIVATE key (so that user can decrypt it locally).
// e.g. GET /api/users/encrypted-private/:userId
router.get("/encrypted-private/:userId",authenticateToken,getEncryptedPrivateKey);

//find the contacts
router.get("/contacts", authenticateToken, getContacts);

//Add friend
router.post("/contacts/:id", authenticateToken, addContact);

//remove friend
router.delete("/contacts/:id", authenticateToken, removeContact);

// GET /api/users/chats
router.get("/chats", authenticateToken, getChats);

// GET /api/users/groups
router.get("/groups", authenticateToken, getGroups);

export default router;
