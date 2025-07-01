# 🧠 System Design – EncryptChatApp

## 1. Introduction

EncryptChatApp is a real-time chat application that offers end-to-end encrypted communication using modern web technologies. Built with TypeScript and React, it implements client-side encryption using the Web Crypto API with ECDH key exchange and AES-GCM encryption. The application features secure messaging, user authentication with JWT tokens, contact management, and real-time communication through WebSockets.

## 2. Architecture Overview

```
React/TypeScript Client ← → Express.js Server ← → MongoDB Database
         ↕                        ↕
   Web Crypto API          Socket.io Server
```

**Key Components:**
- **Frontend:** React 19 + TypeScript + Vite + TailwindCSS 4
- **Backend:** Node.js + Express.js + Socket.io
- **Database:** MongoDB with Mongoose ODM
- **State Management:** Redux Toolkit with async thunks
- **Authentication:** JWT (Access + Refresh tokens with HTTP-only cookies)
- **Encryption:** Web Crypto API (ECDH + AES-GCM)
- **Real-time:** WebSocket communication via Socket.io

## 3. Core Modules

### 3.1 Frontend Architecture

**Technology Stack:**
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6.2.0 with hot reloading
- **Styling:** TailwindCSS 4.1.3 with custom CSS variables for theming
- **State Management:** Redux Toolkit with typed store
- **Routing:** React Router DOM v7.5.0
- **HTTP Client:** Axios for API calls
- **UI Components:** Custom components with React Icons
- **Notifications:** Sonner for toast notifications

**Key Features:**
- ECDH key pair generation and management
- AES-GCM symmetric encryption/decryption
- Passphrase-protected private key storage
- Real-time message handling via WebSocket
- Responsive dark/light theme support
- Type-safe Redux state management

### 3.2 Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with ES modules
- **Framework:** Express.js 5.1.0
- **Database:** MongoDB 6.15.0 with Mongoose 8.13.2
- **Real-time:** Socket.io 4.8.1
- **Authentication:** JSON Web Tokens (jsonwebtoken 9.0.2)
- **Password Hashing:** bcryptjs 3.0.2
- **Environment:** dotenv for configuration

**API Structure:**
- RESTful APIs for CRUD operations
- WebSocket handlers for real-time features
- Middleware for authentication and error handling
- Modular controller and service architecture

## 4. Data Flow & Security Architecture

### 4.1 User Authentication Flow
1. **Registration:** User creates account with name, username, email, password
2. **Login:** Server validates credentials and issues JWT access token + refresh token
3. **Token Management:** Refresh token stored in HTTP-only cookie, access token in memory
4. **Auto-refresh:** Client automatically refreshes access token before expiration

### 4.2 End-to-End Encryption Flow
1. **Key Generation:** Client generates ECDH key pair using Web Crypto API
2. **Key Storage:** 
   - Public key stored on server (Base64 encoded)
   - Private key encrypted with user passphrase using AES-GCM
   - Encrypted private key stored on server
3. **Key Exchange:** When starting chat, client fetches partner's public key
4. **Shared Secret:** Client derives shared AES key using ECDH (own private + partner's public)
5. **Message Encryption:** Messages encrypted with AES-GCM before sending
6. **Message Decryption:** Received messages decrypted locally using shared key

### 4.3 Real-time Communication Flow
1. **Socket Connection:** Client establishes WebSocket connection after authentication
2. **Room Joining:** User joins personal room identified by userId
3. **Message Broadcasting:** Server relays encrypted messages between user rooms
4. **Online Status:** Server tracks and broadcasts user online/offline status

## 5. Database Schema (MongoDB)

### 5.1 User Model
```javascript
{
  _id: ObjectId,
  name: String,                    // Display name
  username: String (unique),       // Login identifier
  email: String (unique),          // Email address
  password: String,                // bcrypt hashed password
  desc: String,                    // User bio/description
  avatar: String,                  // Avatar URL
  
  // Encryption keys
  publicKey: String,               // Base64 ECDH public key
  encryptedPrivateKey: {
    iv: String,                    // Base64 AES-GCM IV
    ciphertext: String             // Base64 encrypted private key
  },
  
  // Relationships
  contacts: [ObjectId],            // User's contact list
  chats: [ObjectId],               // Active chat partners
  groups: [ObjectId],              // Joined groups
  
  // Session data
  refreshToken: String,            // JWT refresh token
  socketId: String,                // Current WebSocket ID
  isOnline: Boolean,               // Online status
  
  timestamps: true                 // createdAt, updatedAt
}
```

### 5.2 Message Model
```javascript
{
  _id: ObjectId,
  sender: ObjectId (ref: User),    // Message sender
  receiver: ObjectId (ref: User),  // Message recipient
  iv: String,                      // Base64 AES-GCM IV
  ciphertext: String,              // Base64 encrypted message
  sentAt: Date,                    // Client timestamp
  timestamps: true                 // createdAt, updatedAt
}
```

### 5.3 Chat Model
```javascript
{
  _id: ObjectId,
  participants: [ObjectId],        // Chat participants
  lastMessage: ObjectId (ref: Message), // Latest message reference
  timestamps: true
}
```

### 5.4 Group Model
```javascript
{
  _id: ObjectId,
  name: String,                    // Group name
  description: String,             // Group description
  avatarUrl: String,               // Group avatar
  members: [ObjectId],             // Group members
  admins: [ObjectId],              // Group administrators
  timestamps: true
}
```

## 6. API Endpoints

### 6.1 Authentication Routes (`/api/auth`)
- `POST /login` - User login with identifier (email/username) and password
- `POST /register` - New user registration
- `POST /logout` - User logout and token cleanup
- `POST /refresh` - Refresh access token using refresh token
- `GET /check` - Check authentication status

### 6.2 User Routes (`/api/users`)
- `GET /profile` - Get authenticated user's profile
- `GET /getAllUsers` - Get all users (admin)
- `GET /find` - Find user by email/username
- `GET /search?term=` - Search users for adding contacts
- `POST /public-key` - Store user's ECDH public key
- `GET /public-key/:userId` - Get user's public key for encryption
- `POST /encrypted-private` - Store encrypted private key
- `GET /encrypted-private/:userId` - Get encrypted private key
- `GET /contacts` - Get user's contact list
- `POST /contacts/:id` - Add user to contacts
- `DELETE /contacts/:id` - Remove user from contacts
- `GET /chats` - Get active chat partners
- `GET /groups` - Get user's groups

### 6.3 Message Routes (`/api/message`)
- `POST /send` - Send encrypted message
- `GET /:partnerId` - Get message history with partner

## 7. WebSocket Events

### 7.1 Connection Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `connect` | Client → Server | Establish WebSocket connection |
| `join` | Client → Server | Join user room with userId and username |
| `disconnect` | Server → Client | Handle user disconnection |

### 7.2 Messaging Events  
| Event | Direction | Data | Description |
|-------|-----------|------|-------------|
| `send-message` | Client → Server | `{sender, receiver, ciphertext, createdAt}` | Send encrypted message |
| `receive-message` | Server → Client | `{sender, ciphertext, createdAt}` | Receive encrypted message |

### 7.3 Status Events
| Event | Direction | Data | Description |
|-------|-----------|------|-------------|
| `online-users` | Server → Client | `[{_id, name}]` | Broadcast online users list |

## 8. State Management (Redux)

### 8.1 Store Structure
```typescript
RootState {
  userProfile: {
    data: UserProfile | null,
    status: "idle" | "loading" | "succeeded" | "failed",
    error: string | null
  },
  social: {
    contacts: { list: Contact[], status, error },
    chats: { list: ChatPartner[], status, error },
    groups: { list: Group[], status, error }
  },
  chat: {
    partnerId: string | null,
    partnerName: string,
    history: ChatMessage[],
    status, error
  }
}
```

### 8.2 Async Thunks
- `fetchUserProfile(token)` - Load user profile and connect socket
- `fetchContacts(token)` - Load user's contacts
- `fetchMyChats(token)` - Load active chat partners
- `fetchMyGroups(token)` - Load user's groups
- `fetchHistory({partnerId, token})` - Load message history
- `addContact({userId, token})` - Add new contact

## 9. Security Implementation

### 9.1 Cryptographic Security
- **Key Exchange:** ECDH with P-256 curve for perfect forward secrecy
- **Symmetric Encryption:** AES-GCM 256-bit for authenticated encryption
- **Key Derivation:** PBKDF2 with 200,000 iterations for passphrase-based keys
- **Random Values:** Crypto-secure random number generation for IVs

### 9.2 Authentication Security
- **Password Hashing:** bcrypt with salt rounds for secure password storage
- **JWT Tokens:** Separate access (short-lived) and refresh (long-lived) tokens
- **HTTP-only Cookies:** Refresh tokens stored in secure, HTTP-only cookies
- **Token Rotation:** Automatic token refresh before expiration

### 9.3 Transport Security
- **HTTPS:** All API communication encrypted in transit
- **WebSocket Security:** Secure WebSocket connections with credential support
- **CORS Configuration:** Proper cross-origin resource sharing setup

## 10. Component Architecture

### 10.1 Layout Components
- **`Layout`** - Main application layout with sidebar and content area
- **`Sidebar`** - Navigation sidebar with page selection
- **`ContentArea`** - Dynamic content area based on selected page
- **`MessageBox`** - Chat interface with encryption/decryption

### 10.2 Feature Components
- **`ChatList`** - List of active chat conversations
- **`ContactList`** - Contact management with search functionality  
- **`GroupList`** - Group chat management (placeholder)
- **`Profile`** - User profile display and settings
- **`Settings`** - Application settings and preferences

### 10.3 Authentication Components
- **`Login`** - User login form with identifier support
- **`Register`** - User registration form
- **`PassphraseModal`** - Secure passphrase input for key decryption
- **`ProtectedRoute`** - Route protection wrapper

### 10.4 Utility Components
- **`AuthProvider`** - Authentication context and key management
- **`SocketListener`** - WebSocket event handler
- **`ThemeProvider`** - Dark/light theme management
- **`LoadingOverlay`** - Loading state indicator

## 11. Crypto Utilities

### 11.1 Key Management Functions
```typescript
generateECDHKeyPair(): Promise<CryptoKeyPair>
exportPublicKeyBase64(pubKey): Promise<string>
importPeerPublicKey(base64): Promise<CryptoKey>
exportPrivateKeyJWK(privKey): Promise<JsonWebKey>
importPrivateKeyJWK(jwk): Promise<CryptoKey>
deriveSharedAESKey(myPrivate, theirPublic): Promise<CryptoKey>
```

### 11.2 Encryption Functions
```typescript
encryptAESGCM(aesKey, plaintext): Promise<{iv, ciphertext}>
decryptAESGCM(aesKey, iv, ciphertext): Promise<string>
deriveKeyFromPassphrase(passphrase, salt): Promise<CryptoKey>
importPublicKeyFromJWK(jwk): Promise<CryptoKey>
```

## 12. Development & Build

### 12.1 Frontend Build Process
- **Development:** Vite dev server with hot reloading
- **Build:** TypeScript compilation + Vite production build
- **Linting:** ESLint with TypeScript and React rules
- **Styling:** TailwindCSS with custom CSS variables

### 12.2 Backend Configuration
- **Environment:** ES modules with dotenv configuration
- **Database:** MongoDB connection with Mongoose schemas
- **Socket.io:** CORS-enabled WebSocket server
- **Authentication:** JWT secret and refresh token management

## 13. Future Enhancements

### 13.1 Planned Features
- **Group Chats:** Multi-user encrypted group messaging
- **File Sharing:** Encrypted file and media sharing
- **Message Status:** Read receipts and delivery confirmations
- **Self-Destructing Messages:** Time-based message deletion
- **Push Notifications:** Real-time notification system

### 13.2 Security Enhancements
- **Key Rotation:** Periodic ECDH key pair rotation
- **Message Integrity:** Digital signatures for message authenticity
- **Forward Secrecy:** Enhanced key management for perfect forward secrecy
- **Backup & Recovery:** Secure key backup and account recovery

### 13.3 Performance Optimizations
- **Message Pagination:** Efficient loading of message history
- **Connection Pooling:** Optimized database connections
- **CDN Integration:** Static asset delivery optimization
- **PWA Support:** Progressive Web App capabilities

### 13.4 User Experience
- **Mobile Responsiveness:** Enhanced mobile interface
- **Accessibility:** ARIA labels and keyboard navigation
- **Internationalization:** Multi-language support
- **Voice Messages:** Audio message encryption support