import express, { Request } from 'express';
const router = express.Router();
import Notification from '../models/notification';
import User from '../models/user';

interface Notif {
  type: string;
  message: string;
  read: boolean;
  user: string;
}

interface NotifReq {
  action: string;
  user: string;
  payload?: Notif;
}

interface CustomRequest<T> extends Request {
  body: T;
}

router.post('/', async (req: CustomRequest<NotifReq>, res) => {
  // read notifs, set notifs to seen
  if (req.body.action === 'READ') {
    const user = await User.findOne({ displayName: req.body.user });
    if (user) {
      await Notification.updateMany({ user: user._id }, { read: true });
      return res.status(204).json({ message: 'Success' });
    }
  }
  // If User req, check action
  if (req.body.action === 'GET') {
    const user = await User.findOne({ displayName: req.body.user });
    const notifications = await Notification.find({ user: user?._id });
    return res.json(notifications.map((notification) => notification.toJSON()));
  }

  if (req.body.action === 'POST') {
    const notification = new Notification({
      ...req.body?.payload,
    });

    const savedNotification = await notification.save();
    return res.status(201).json(savedNotification.toJSON());
  }

  return res.status(400).send({ error: "Request failed" });
});

export default router;

