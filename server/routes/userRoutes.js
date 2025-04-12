import express from "express";
import { getAllUsers} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authTokenMiddleware.js";

const router = express.Router();

//get all users
router.get("/getAllUsers",getAllUsers);

//auth token test route
router.get("/profile", authenticateToken, (req, res) => {
    res.status(200).json({
      success: true,
      message: "You are authorized!",
      user: req.user,
    });
  });

export default router;