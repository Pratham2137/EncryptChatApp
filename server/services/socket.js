import {io} from 'socket.io-client';
import { SOCKET_URL } from "../config/socketConfig.js";


const socket = io(SOCKET_URL);

socket.on("connect", ()=>{
    console.log("Connected to the server");
});

socket.on("disconnect", ()=>{
    console.log("Disconnected from server.");
});