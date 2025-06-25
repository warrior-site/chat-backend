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
          sender: msg.sender,
          content: msg.text,
          timestamp: msg.timestamp || new Date(),
          ...(msg.chatType === 'friend'
            ? { receiver: msg.targetId }
            : { group: msg.targetId }),
        });

        await newMessage.save();
        console.log('✅ Message saved:', newMessage);
      } catch (err) {
        console.error('❌ Error saving message:', err.message);
      }

      io.emit('chat-message', msg); // broadcast to all (you can limit this if needed)
    });

    socket.on('message-reaction', async ({ messageId, emoji, userId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        message.reactions.forEach((r) => {
          r.users = r.users.filter((uid) => uid.toString() !== userId);
        });

        const existing = message.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          existing.users.push(userId);
        } else {
          message.reactions.push({ emoji, users: [userId] });
        }

        message.reactions = message.reactions.filter(r => r.users.length > 0);
        await message.save();

        io.emit('reaction-updated', {
          messageId,
          reactions: message.reactions,
        });
      } catch (err) {
        console.error('❌ Error updating reaction:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });
}
