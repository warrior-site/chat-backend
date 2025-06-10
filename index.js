// server/index.js
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const dotenv = require('dotenv')
const registerSocketEvents = require('./socket')

// Load environment variables
dotenv.config()

// Create Express app and HTTP server
const app = express()
const server = http.createServer(app)

// Allow frontend origin (adjust if you deploy)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}))

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Register socket events from external file
registerSocketEvents(io)

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
