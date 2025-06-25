// server/index.js
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import cors from 'cors';

import connect from './db/db.js';
import authController from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import registerSocketEvents from './socket.js';
import messageRoutes from './routes/message.route.js';
import chatRoutes from './routes/chat.route.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
 'https://chat-frontend-eight-xi.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authController);
app.use("/api/user", userRoute);
app.use("/api/messages", messageRoutes);
app.use("/api/ai",chatRoutes)

// ✅ Create Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

registerSocketEvents(io);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connect();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
