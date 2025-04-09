# 🧠 System Design – EncryptChatApp

## 1. Introduction

EncryptChatApp is a real-time chat application that offers end-to-end encrypted communication. It uses WebSockets for real-time updates and Web Crypto API for robust client-side encryption. It supports secure messaging, authentication, and self-destructing messages.

## 2. Architecture Overview

**Client** → **WebSocket Server (Express + Socket.io)** → **MongoDB (via Mongoose)**

- Client uses Web Crypto API for key generation and encryption.
- Server handles encrypted messages and session tracking.
- MongoDB stores user data and encrypted message blobs.

## 3. Core Modules

### 3.1 Frontend

- Vite + Tailwind CSS for rapid UI development
- Key generation (ECDH), symmetric key derivation (AES-GCM)
- WebSocket integration for real-time updates

### 3.2 Backend

- Express.js for REST APIs
- Socket.io for real-time messaging
- Mongoose for MongoDB ORM
- JWT for user auth
- Services module for encryption logic, sockets

## 4. Data Flow

1. **User Registration/Login**
   - REST API → Auth controller → JWT token issued

2. **Chat Session Initiation**
   - Client generates ECDH key pair
   - Public key shared via WebSocket to other user

3. **Secure Messaging**
   - Shared symmetric key derived using ECDH
   - Messages encrypted with AES-GCM
   - Encrypted blob sent via WebSocket

4. **Message Storage**
   - Server receives encrypted blob
   - Saves message metadata + blob in MongoDB

## 5. Database Schema (MongoDB)

### User

```js
{
  username: String,
  email: String,
  password: String, // hashed
  publicKey: String,
  lastSeen: Date
}
```

### Message

```js
{
  sender: ObjectId,
  receiver: ObjectId,
  content: String, // encrypted blob
  timestamp: Date,
  selfDestruct: Boolean
}
```

## 6. Security Model

- **ECDH** for key exchange (Web Crypto API)
- **AES-GCM** for encryption (authenticated encryption)
- **JWT** for secure login sessions
- **Self-destructing messages** using timers on the frontend and expiration flags in DB

## 7. WebSocket Events

| Event         | Description                          |
|---------------|--------------------------------------|
| `connect`     | Establish socket connection          |
| `joinRoom`    | Join a user chat room                |
| `sendMessage` | Send encrypted message               |
| `receiveMessage` | Receive message on client         |
| `keyExchange` | Share ECDH public key                |
| `typing`      | Notify if user is typing             |

## 8. Future Enhancements

- Media sharing with encryption
- Group chats with group key management
- QR-code based key exchange
- Progressive Web App (PWA) support