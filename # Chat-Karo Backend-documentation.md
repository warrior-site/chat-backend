# Chat-Karo Backend

This backend powers the Chat-Karo application, providing REST APIs, authentication, real-time chat, email verification, user profile management, and AI chat integration.

---

## 📁 Working Structure

```
backend/
│
├── .env                      # Environment variables (DB, JWT, API keys, etc.)
├── index.js                  # 🚀 Entry point: starts Express server, sets up Socket.IO, connects DB, loads routes
├── package.json              # NPM dependencies and scripts
├── socket.js                 # Real-time chat logic (Socket.IO events: join, chat, reactions)
├── vercel.json               # Vercel deployment config
│
├── cloudinary/
│   └── cloudinary.config.js  # Cloudinary setup for image uploads
│
├── controllers/
│   ├── auth.controller.js    # Auth logic (signup, login, verify email, etc.)
│   └── user.controller.js    # User profile and preferences logic
│
├── db/
│   └── db.js                 # MongoDB connection logic
│
├── mailtrap/
│   ├── email.js              # Mailtrap-based email sending (legacy/optional)
│   ├── emailService.js       # Email sending via Gmail (verification, welcome)
│   ├── emailTemplate.js      # HTML templates for emails
│   ├── emailTransport.js     # Nodemailer transport config (Gmail)
│   └── mailtrap.config.js    # Mailtrap API config (legacy/optional)
│
├── middleware/
│   └── verifyToken.js        # JWT authentication middleware
│
├── models/
│   ├── message.model.js      # Mongoose schema for chat messages (with reactions)
│   └── user.model.js         # Mongoose schema for users (profile, preferences)
│
├── routes/
│   ├── auth.route.js         # Auth API routes (signup, login, verify, etc.)
│   ├── chat.route.js         # AI chat API route (Gemini integration)
│   ├── message.route.js      # Message API routes (fetch all messages)
│   └── user.route.js         # User API routes (profile, preferences)
│
├── uploads/                  # Temporary file uploads (used by multer)
│
└── utils/
    └── setCookies.js         # Utility to set JWT cookies on response
```

---

## 🔄 System Flow: Frontend ↔ Backend

### User Authentication & Profile

```
[Frontend: Login/Signup Page]
        │   (POST /api/auth/signup or /login)
        ▼
[Backend: auth.route.js]
        │   (Validates, creates user, sends verification email)
        ▼
[Frontend: VerifyEmail Page]
        │   (POST /api/auth/verify-email)
        ▼
[Backend: auth.controller.js]
        │   (Verifies code, updates user)
        ▼
[Frontend: Dashboard Page]
        │   (GET/POST /api/user/profile, /api/user/preferences)
        ▼
[Backend: user.route.js, user.controller.js]
```

### Real-Time Chat

```
[Frontend: ChatRoom.jsx]
        │   (Socket.IO connect, send/receive messages)
        ▼
[Backend: socket.js]
        │   (Handles join, chat-message, reactions)
        ▼
[MongoDB: message.model.js]
        │
        ▼
[All Connected Users]
```

### AI Chat

```
[Frontend: AIChat.jsx]
        │   (POST /api/ai/chat)
        ▼
[Backend: chat.route.js]
        │   (Calls Gemini API, returns AI response)
        ▼
[Frontend: AIChat.jsx]
```

### Personalization

```
[Frontend: Personalization.jsx]
        │   (POST /api/user/preferences)
        ▼
[Backend: user.route.js, user.controller.js]
        │   (Saves theme, font, background, etc.)
        ▼
[Frontend: Applies preferences]
```

---

## 🚦 Entry Point

- **index.js**  
  - Loads environment variables.
  - Sets up Express app and HTTP server.
  - Configures CORS, JSON parsing, cookies.
  - Registers all API routes (`/api/auth`, `/api/user`, `/api/messages`, `/api/ai`).
  - Initializes Socket.IO for real-time chat.
  - Connects to MongoDB.
  - Starts the server on the configured port.

---

## 🔌 What does `socket.js` do?

- Handles all **real-time chat logic** using Socket.IO.
- Listens for:
  - **join**: Notifies others when a user joins.
  - **chat-message**: Saves messages to MongoDB and broadcasts them.
  - **message-reaction**: Handles emoji reactions on messages, updates DB, and broadcasts changes.
  - **disconnect**: Logs when a user disconnects.
- Ensures chat and reactions are live and persistent.

---

## 🛠️ Main Functionalities

- **Authentication**
  - Signup, login, logout, JWT-based session, email verification.
- **User Profile**
  - Update profile, upload profile picture (Cloudinary), set preferences (theme, font, etc.).
- **Chat**
  - Real-time messaging with Socket.IO.
  - Emoji reactions on messages.
  - Message persistence in MongoDB.
- **AI Chat**
  - `/api/ai/chat` endpoint integrates with Google Gemini for AI-powered responses.
- **Email**
  - Sends verification and welcome emails using Gmail (Nodemailer).
- **File Uploads**
  - Handles profile and background image uploads via multer and Cloudinary.

---

## File/Folder Roles

- **.env**: Stores sensitive config (DB URI, JWT secret, API keys, email credentials).
- **index.js**: Sets up Express server, middleware, routes, Socket.IO, and DB connection.
- **socket.js**: Handles real-time events (join, chat-message, reactions) for Socket.IO.
- **vercel.json**: Ensures correct routing for Vercel deployments.

### Folders

- **cloudinary/**: Cloudinary config for uploading images (profile pictures, backgrounds).
- **controllers/**: Business logic for authentication and user management.
- **db/**: MongoDB connection logic.
- **mailtrap/**: Email sending utilities (Mailtrap and Gmail/Nodemailer).
- **middleware/**: Express middleware (JWT verification).
- **models/**: Mongoose schemas for User and Message.
- **routes/**: Express route definitions for API endpoints.
- **uploads/**: Temporary storage for uploaded files (handled by multer).
- **utils/**: Helper utilities (e.g., set JWT cookies).

---

## 📝 How to Run

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your `.env` file with MongoDB, JWT, Gmail, and API keys.
3. Start the server:
   ```sh
   npm run dev
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000).

---

For more details, see each file’s comments or ask for specific implementation explanations.