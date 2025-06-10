// server/socket.js
module.exports = function registerSocketEvents(io) {
  io.on('connection', (socket) => {
    console.log(`🟢 New user connected: ${socket.id}`)

    // Join event (optional)
    socket.on('join', (username) => {
      console.log(`👤 ${username} joined the chat.`)
      socket.broadcast.emit('user-joined', username)
    })

    // Handle incoming messages
    socket.on('chat-message', (msg) => {
      console.log(`📩 Message from ${msg.sender}: ${msg.text}`)

      // Broadcast message to all clients (including sender)
      io.emit('chat-message', msg)
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔴 User disconnected: ${socket.id}`)
    })
  })
}
