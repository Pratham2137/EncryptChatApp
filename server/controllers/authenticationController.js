import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

//login user
export const loginUser = async (req, res) => {
  try {
    // const { email, password } = req.body;
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // look up by email OR username (case-insensitive)
    const lookup = identifier.toLowerCase();
    const user = await User.findOne({
      $or: [{ email: lookup }, { username: lookup }],
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatched = await user.matchPassword(password);
    if (!isMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // Send refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production"
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successful",
      accessToken,
    });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
    console.error("Login error after headers sent:", error);
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  try {
    const { refreshToken: RefreshToken } = req.cookies;

    if (!RefreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    let payload;
    try {
      payload = jwt.verify(RefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      console.error("Error verifying refresh token:", error);
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    let user;
    try {
      user = await User.findById(payload.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error finding user:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Remove refresh token from user record
    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production"
      sameSite: "Lax", //Strict
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
    console.error("Unhandled logout error after headers sent:", error);
  }
};

//register user
export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validate input
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if email or username already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(409).json({ message: "Email is already in use." });
    }
    const usernameExists = await User.findOne({
      username: username.toLowerCase(),
    });
    if (usernameExists) {
      return res.status(409).json({ message: "Username is already taken." });
    }

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password, // will be hashed by schema.pre("save")
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token not found" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.userId);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// Check user authentication status
export const checkAuth = async (req, res) => {
  // We expect the client to send the refreshToken cookie.
  const { refreshToken } = req.cookies || {};

  if (!refreshToken) {
    // No cookie at all → send HTTP 200 but success:false
    return res.status(200).json({
      success: false,
      message: "No refresh token provided",
    });
  }

  try {
    // Verify that the refresh token is valid
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Look up the user
    const user = await User.findById(payload.userId);
    if (!user) {
      // If user not found, still respond with HTTP 200 + success:false
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    // (Optionally: check that user.refreshToken matches the cookie you got,
    //  but often the JWT verification step is sufficient.)

    // Issue a brand-new accessToken
    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    // Any error verifying the refresh token (expired, malformed, etc.)
    // → respond 200 { success:false, message: "…expired…" }
    return res.status(200).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};