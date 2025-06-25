// routes/message.route.js
import express from 'express';
import Message from '../models/message.model.js';

const router = express.Router();

// POST /api/messages/fetch
router.post('/fetch', async (req, res) => {
  const { userId, chatType, targetId } = req.body;
console.log("it is hit")
  try {
    let messages = [];

    if (chatType === 'friend') {
      messages = await Message.find({
        $or: [
          { sender: userId, receiver: targetId },
          { sender: targetId, receiver: userId }
        ]
      })
        .sort({ timestamp: 1 })
        .populate('sender', 'username');
    }

    if (chatType === 'group') {
      messages = await Message.find({ group: targetId })
        .sort({ timestamp: 1 })
        .populate('sender', 'username');
    }

    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching chat messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
