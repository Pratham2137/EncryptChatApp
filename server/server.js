import express from "express";
import http from 'http';
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A new Client connected");

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});
app.set("socketio", io);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

