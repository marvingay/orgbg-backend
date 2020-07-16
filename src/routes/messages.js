const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const User = require('../models/user');
// TODO: refactor date formatting to own utility
const format = require('date-fns/format');

// TODO: GET USER MESSAGES via POST
router.post('/all', async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ displayName: body.name });
  console.log(user);
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

// TODO: POST USER MESSAGES
router.post('/', async (req, res) => {
  const body = req.body;
  const sender = await User.findOne({ displayName: body.sender });
  console.log(sender);
  const recipient = await User.findOne({ displayName: body.recipient });
  console.log(recipient);
  if (!sender || !recipient)
    return res.status(400).json({ error: 'invalid user' });

  const message = new Message({
    body: body.message,
    seen: false,
    date: format(new Date(), 'MM/dd/yy h:mm a O'),
    sender: sender._id,
    recipient: recipient._id,
  });
  console.log(message);

  const savedMessage = await message.save();
  res.status(201).json(savedMessage.toJSON());
});

module.exports = router;
