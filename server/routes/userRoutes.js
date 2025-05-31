import express from "express";
import { addContact, createPublicKey, fetchUserProfile, findUser, getAllUsers, getChats, getContacts, getGroups, removeContact, searchUsers} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authTokenMiddleware.js";

const router = express.Router();

// routes/users.js
router.post('/public-key', authenticateToken, createPublicKey);

//get all users
router.get("/getAllUsers", authenticateToken ,getAllUsers);

//auth token test route
router.get("/profile", authenticateToken, fetchUserProfile); 

// find user by email and username
router.get("/find", authenticateToken, findUser);

//find users excluding current user and friends
router.get("/search", authenticateToken, searchUsers);

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