const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const User = require('../models/user');

router.post('/all', async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ displayName: body.name });
  // Find All Messages via if User is sender or recipient
  const userMessages = await Message.find({
    $or: [{ sender: user._id }, { recipient: user._id }],
  }).populate({
    path: 'sender recipient',
    populate: {
      path: 'sender',
      select: { displayName: 1 },
    },
    populate: 'recipient',
    select: { displayName: 1 },
  });

  return res.json(userMessages.map((message) => message.toJSON()));
});

router.post('/', async (req, res) => {
  const body = req.body;
  const sender = await User.findOne({ displayName: body.sender });
  const recipient = await User.findOne({ displayName: body.recipient });
  if (!sender || !recipient)
    return res.status(400).json({ error: 'invalid user' });

  const message = new Message({
    body: body.message,
    seen: false,
    date: new Date(),
    sender: sender._id,
    recipient: recipient._id,
  });

  const savedMessage = await message.save();
  res.status(201).json(savedMessage.toJSON());
});

module.exports = router;
