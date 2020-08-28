import express, { Request } from 'express';
const router = express.Router();
import Message from '../models/message';
import User from '../models/user';

interface MessageReq {
  name: string;
  sender: string;
  recipient: string;
  message: string;
}

interface CustomRequest<T> extends Request {
  body: T;
}

router.post('/all', async (req: CustomRequest<MessageReq>, res) => {
  const body = req.body;
  const user = await User.findOne({ displayName: body.name });
  // Find All Messages via if User is sender or recipient
  const userMessages = await Message.find({ $or: [{ sender: user?._id }, { recipient: user?._id }] })
    .populate({ path: 'sender', select: 'displayName' })
    .populate({ path: 'recipient', select: 'displayName' });

  return res.json(userMessages.map((message) => message.toJSON()));
});

router.post('/', async (req: CustomRequest<MessageReq>, res) => {
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
  return res.status(201).json(savedMessage.toJSON());
});

export default router;
