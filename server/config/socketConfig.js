import dotenv from "dotenv";
dotenv.config();

export const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:3000";
