import Message from './models/message.model.js';

export default function registerSocketEvents(io) {
  io.on('connection', (socket) => {
    console.log(`🟢 New user connected: ${socket.id}`);

    socket.on('join', (username) => {
      console.log(`👤 ${username} joined the chat.`);
      socket.broadcast.emit('user-joined', username);
    });

    socket.on('chat-message', async (msg) => {
      console.log(`📩 Message from ${msg.sender}: ${msg.text}`);

      try {
        const newMessage = new Message({
          sender: msg.userId, // should be a valid MongoDB ObjectId (string is fine)
          content: msg.text,
          timestamp: msg.timestamp || new Date(),
        });

        await newMessage.save();

        console.log('✅ Message saved to DB:', newMessage);
      } catch (err) {
        console.error('❌ Error saving message:', err.message);
      }

      io.emit('chat-message', msg); // Broadcast to all
    });

    socket.on('disconnect', () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });
}
