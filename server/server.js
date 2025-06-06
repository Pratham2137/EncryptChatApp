import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { initSocket } from "./services/socket.js";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/userRoutes.js"
import messageRoutes from "./routes/messageRoutes.js";
import authRoutes from "./routes/authenticationRoutes.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(cors({
  origin: process.env.FRONT_END_URL?.split(",") || [],
  credentials: true,
}))
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

//MongoDB Connection
connectDB();

//Http + Socket.io server
const server = http.createServer(app);
initSocket(server);

//Routes

// Basic route to test server
app.get("/", (req, res) => {
  res.send("<h1>Real-Time Chat Server</h1>");
});

//Authentication Routes
app.use("/api/auth",authRoutes);

//user Routes
app.use("/api/users",userRoutes);

//Message Routes
app.use("/api/message",messageRoutes)

//Test Route
// app.use("/test",(res,req)=>{
//   res.send("hello Test");
// });


//Start Server
server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
