# EncryptChatApp 🔐

EncryptChatApp is an end-to-end encrypted real-time chat application built with the MERN stack, WebSockets, and modern cryptography principles. The app prioritizes secure communication using ECDH for key exchange and AES-GCM for symmetric encryption, ensuring messages remain private and tamper-proof.

## 🌐 Tech Stack

- **Frontend:** Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Realtime:** WebSockets
- **Security:** Web Crypto API, ECDH, AES-GCM
- **Design:** Responsive UI with Tailwind CSS
- **Architecture:** Modular and scalable MERN stack

## 📁 Folder Structure

```plaintext
EncryptChatApp/
│   .gitignore
│   package.json
│   package-lock.json
│   Readme.md
│
├── docs/
│   └── system-design.md
│
└── server/
    │   server.js
    │   client.js
    │   .env
    │   package.json
    │
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── utils/
    ├── services/
    └── config/           
```

## ⚙️ Features

- End-to-End Encrypted Messaging
- Secure Key Exchange (ECDH)
- AES-GCM Encryption for Messages
- Real-time Communication with WebSockets
- User Authentication (JWT-based)
- Self-Destructing Messages
- Typing Indicators, Message Delivery Status

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/EncryptChatApp.git
   cd EncryptChatApp
   ```

2. Install dependencies:
   ```bash
   cd server
   npm install
   ```

3. Create `.env` file and add your configs:
   ```env
   PORT=5000
   MONGODB_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Run the backend server:
   ```bash
   npm run dev
   ```

## 📄 Documentation

- [System Design Documentation](docs/system-design.md)

## 📌 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.