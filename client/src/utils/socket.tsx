import {io} from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL);

socket.on("connect", ()=>{
    console.log("Connected to the server");
});

socket.on("disconnect", ()=>{
    console.log("Disconnected from server.");
});

export default socket;