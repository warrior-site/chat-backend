// routes/message.route.js
import express from 'express';
import Message from '../models/message.model.js';

const router = express.Router();

// GET all messages
router.get('/all', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: 1 })
      .populate('sender', 'username'); // populate sender details
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
