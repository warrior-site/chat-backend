// server/index.js
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import cors from 'cors';

import registerSocketEvents from './socket.js';
import authController from './routes/auth.route.js';
import connect from './db/db.js';


// Create Express app and HTTP server
const app = express()
const server = http.createServer(app)

// Allow frontend origin (adjust if you deploy)
app.use(cors({
  origin: ['http://localhost:5173', 'https://chat-frontend-eight-xi.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true // Allow cookies to be sent
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use("/api/auth", authController)








// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Register socket events from external file
registerSocketEvents(io)

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  connect() // Connect to MongoDB
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
