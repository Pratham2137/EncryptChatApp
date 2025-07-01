# EncryptChatApp 🔐

EncryptChatApp is a modern, end-to-end encrypted real-time chat application built with the MERN stack, TypeScript, and advanced cryptography. The application prioritizes security and privacy through client-side encryption using ECDH key exchange and AES-GCM symmetric encryption, ensuring that messages remain private and tamper-proof.

## ✨ Features

### 🔒 Security & Privacy
- **End-to-End Encryption** using Web Crypto API
- **ECDH Key Exchange** with P-256 curve for perfect forward secrecy
- **AES-GCM Encryption** for authenticated symmetric encryption
- **Passphrase-Protected Keys** with PBKDF2 key derivation
- **Secure Authentication** with JWT access and refresh tokens

### 💬 Communication
- **Real-time Messaging** via WebSocket connections
- **Contact Management** with search and add functionality
- **Online Status Tracking** for connected users
- **Message History** with client-side decryption
- **Group Chat Support** (foundation implemented)

### � User Experience
- **Modern React UI** with TypeScript for type safety
- **Dark/Light Theme** support with system preference detection
- **Responsive Design** optimized for desktop and mobile
- **Toast Notifications** for user feedback
- **Loading States** and error handling

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6.2.0
- **Styling:** TailwindCSS 4.1.3 with custom CSS variables
- **State Management:** Redux Toolkit with async thunks
- **Routing:** React Router DOM v7.5.0
- **HTTP Client:** Axios with interceptors
- **Icons:** React Icons library
- **Notifications:** Sonner toast notifications

### Backend
- **Runtime:** Node.js with ES modules
- **Framework:** Express.js 5.1.0
- **Database:** MongoDB 6.15.0 with Mongoose 8.13.2
- **Real-time:** Socket.io 4.8.1
- **Authentication:** JSON Web Tokens 9.0.2
- **Password Hashing:** bcryptjs 3.0.2
- **Environment:** dotenv configuration

### Security & Encryption
- **Web Crypto API** for ECDH and AES-GCM operations
- **PBKDF2** key derivation with 200,000 iterations
- **HTTP-only Cookies** for refresh token storage
- **CORS Configuration** for secure cross-origin requests

## 📁 Project Structure

```
EncryptChatApp/
├── 📄 README.md
├── 📄 package.json
├── 📁 docs/
│   └── 📄 system-design.md
├── 📁 client/
│   ├── 📄 package.json
│   ├── 📄 vite.config.ts
│   ├── 📄 tailwind.config.js
│   ├── 📄 tsconfig.json
│   ├── 📁 public/
│   │   └── 📄 vite.svg
│   └── 📁 src/
│       ├── 📄 App.tsx
│       ├── 📄 main.tsx
│       ├── 📁 components/
│       │   ├── 📁 Auth/          # Authentication components
│       │   ├── 📁 Chats/         # Chat list and management
│       │   ├── 📁 Contacts/      # Contact management
│       │   ├── 📁 Groups/        # Group chat components
│       │   ├── 📁 Message/       # Message box and display
│       │   ├── 📁 Navigation/    # Sidebar navigation
│       │   ├── 📁 Settings/      # User settings and profile
│       │   └── 📁 Socket/        # WebSocket event handlers
│       ├── 📁 features/          # Redux store slices
│       │   ├── 📄 store.ts
│       │   ├── 📁 chat/          # Chat state management
│       │   ├── 📁 contact/       # Contact state management
│       │   ├── 📁 social/        # Social features state
│       │   └── 📁 userProfile/   # User profile state
│       ├── 📁 utils/             # Utility functions
│       │   ├── 📄 crypto.ts      # Encryption utilities
│       │   ├── 📄 socket.tsx     # Socket connection
│       │   ├── 📄 AuthContext.ts # Authentication context
│       │   └── 📄 AuthProvider.tsx
│       └── 📁 assets/            # Static assets and images
└── 📁 server/
    ├── 📄 package.json
    ├── 📄 server.js
    ├── 📁 config/
    │   └── 📄 db.js              # Database configuration
    ├── 📁 controllers/           # API route handlers
    │   ├── 📄 authenticationController.js
    │   ├── 📄 messageController.js
    │   └── 📄 userController.js
    ├── 📁 middlewares/           # Express middlewares
    │   └── 📄 authTokenMiddleware.js
    ├── 📁 models/                # MongoDB schemas
    │   ├── 📄 userModel.js
    │   ├── 📄 messageModel.js
    │   ├── 📄 chatModel.js
    │   └── 📄 groupModel.js
    ├── 📁 routes/                # API routes
    │   ├── 📄 authenticationRoutes.js
    │   ├── 📄 messageRoutes.js
    │   └── 📄 userRoutes.js
    ├── 📁 services/              # Business logic services
    │   └── 📄 socket.js          # Socket.io configuration
    └── 📁 utils/                 # Utility functions
        ├── 📄 generateTokens.js
        └── 📄 tokenEncryption.js
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/EncryptChatApp.git
cd EncryptChatApp
```

### 2. Backend Setup
```bash
cd server
npm install
```

### 3. Environment Configuration
Create a `.env` file in the server directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/encryptchatapp

# JWT Secrets (use strong, random strings)
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Frontend URL for CORS
FRONT_END_URL=http://localhost:5173
```

### 4. Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the client directory:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=EncryptChatApp
```

### 5. Database Setup
Make sure MongoDB is running on your system:
```bash
# For MongoDB service
sudo systemctl start mongod

# Or using MongoDB Community Edition
mongod --dbpath /path/to/your/db
```

### 6. Start the Application

#### Development Mode
```bash
# Terminal 1 - Start Backend Server
cd server
npm run dev

# Terminal 2 - Start Frontend Development Server
cd client
npm run dev
```

#### Production Mode
```bash
# Build the frontend
cd client
npm run build

# Start the production server
cd ../server
npm start
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Socket.io:** http://localhost:5000 (WebSocket)

## 🔑 How It Works

### 1. User Registration & Authentication
1. User creates account with name, username, email, and password
2. Server generates JWT access and refresh tokens
3. Refresh token stored in HTTP-only cookie for security

### 2. Key Generation & Management
1. Client generates ECDH key pair using Web Crypto API
2. Public key sent to server for storage (Base64 encoded)
3. Private key encrypted with user's passphrase using AES-GCM
4. Encrypted private key stored on server for cross-device access

### 3. Secure Messaging Process
1. When starting a chat, client fetches partner's public key
2. Client derives shared AES key using ECDH (own private + partner's public)
3. Messages encrypted with AES-GCM before sending via WebSocket
4. Server relays encrypted messages without decryption capability
5. Recipient decrypts messages using the same shared key

### 4. Real-time Communication
1. WebSocket connection established after authentication
2. Users join personal rooms identified by their userId
3. Messages broadcast to specific user rooms
4. Online status updates broadcast to all connected clients

## 🧪 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login with email/username and password
- `POST /api/auth/logout` - Logout and clear tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/check` - Check authentication status

### User Management
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/search?term=` - Search for users to add as contacts
- `POST /api/users/public-key` - Store ECDH public key
- `GET /api/users/public-key/:userId` - Get user's public key

### Messaging
- `POST /api/message/send` - Send encrypted message
- `GET /api/message/:partnerId` - Get message history

### Social Features
- `GET /api/users/contacts` - Get contact list
- `POST /api/users/contacts/:id` - Add contact
- `DELETE /api/users/contacts/:id` - Remove contact
- `GET /api/users/chats` - Get active chats

## 🔐 Security Features

### Client-Side Encryption
- **ECDH Key Exchange** - Secure key agreement protocol
- **AES-GCM Encryption** - Authenticated encryption for messages
- **Web Crypto API** - Browser-native cryptographic operations
- **Key Derivation** - PBKDF2 with high iteration count

### Authentication Security
- **JWT Tokens** - Stateless authentication with access/refresh pattern
- **HTTP-only Cookies** - Secure refresh token storage
- **Password Hashing** - bcrypt with salt for password protection
- **Token Rotation** - Automatic token refresh mechanism

### Transport Security
- **HTTPS/WSS** - Encrypted communication channels
- **CORS Protection** - Configured cross-origin policies
- **Input Validation** - Server-side request validation

## 🎯 Usage Guide

### Getting Started
1. **Register** a new account with your details
2. **Set a passphrase** when prompted (this encrypts your private key)
3. **Add contacts** by searching for users by email or username
4. **Start chatting** by selecting a contact from your chat list
5. **Stay secure** - your messages are encrypted end-to-end automatically

### Key Features
- **Search Users**: Find new contacts using the search functionality
- **Real-time Chat**: Send and receive messages instantly
- **Cross-device Sync**: Access your encrypted messages from any device
- **Dark/Light Mode**: Toggle between themes in settings
- **Online Status**: See when your contacts are online

## 🧪 Testing

### Manual Testing
1. Register multiple test accounts
2. Add contacts between accounts
3. Test real-time messaging
4. Verify encryption by checking browser developer tools
5. Test cross-device functionality

### Security Verification
- Messages stored in database are encrypted (check MongoDB)
- Private keys are never sent to server in plaintext
- WebSocket messages contain only encrypted data
- Refresh tokens are HTTP-only cookies

## 🚧 Known Limitations

- Group chat functionality is foundational but not fully implemented
- File sharing is not yet supported
- Message search is not implemented
- Mobile app is not available (web-only)
- Offline message delivery requires improvements

## 🛠️ Development

### Available Scripts

#### Frontend (client/)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

#### Backend (server/)
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
npm test             # Run tests (not implemented)
```

### Development Tools
- **Hot Reload**: Vite provides instant updates during development
- **Type Checking**: TypeScript ensures type safety
- **Linting**: ESLint maintains code quality
- **MongoDB Compass**: Visual database management
- **Postman**: API endpoint testing

## 🐛 Troubleshooting

### Common Issues

#### Connection Issues
- Ensure MongoDB is running
- Check CORS configuration in server
- Verify environment variables are set correctly

#### Encryption Issues  
- Clear browser storage and re-login
- Ensure Web Crypto API is supported (modern browsers only)
- Check that HTTPS is used in production

#### Build Issues
- Delete `node_modules` and reinstall dependencies
- Check Node.js version compatibility
- Verify TypeScript configuration

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed
- Keep commits atomic and descriptive

## 📄 Documentation

- 📖 [System Design Documentation](docs/system-design.md) - Detailed technical architecture
- 🔐 [Security Model](docs/system-design.md#9-security-implementation) - Encryption and security details
- 🏗️ [API Reference](docs/system-design.md#6-api-endpoints) - Complete API documentation

## � License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 👤 Author

**Pratham** - *Lead Developer*

## 🙏 Acknowledgments

- **Web Crypto API** - For browser-native cryptography
- **React Team** - For the amazing React framework
- **MongoDB** - For flexible document database
- **Socket.io** - For real-time communication
- **TailwindCSS** - For utility-first styling
- **Open Source Community** - For endless inspiration and resources

---

⭐ **Star this repo** if you found it helpful!

🐛 **Report bugs** by opening an issue

💡 **Request features** via the issues tab

📧 **Contact** for questions or collaboration opportunities