const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const User = require('../models/user');

router.post('/', async (req, res) => {
  const { body } = req;

  // read notifs, set notifs to seen
  if (body.action === 'READ') {
    const user = await User.findOne({ displayName: body.user });
    await Notification.updateMany({ user: user._id }, { read: true });
    return res.status(204).json({ message: 'Success' });
  }
  // If User req, check action
  if (body.action === 'GET') {
    const user = await User.findOne({ displayName: body.user });
    const notifications = await Notification.find({ user: user._id });
    return res.json(notifications.map((notification) => notification.toJSON()));
  }

  if (body.action === 'POST') {
    const notification = new Notification({
      ...body.payload,
    });

    const savedNotification = await notification.save();
    return res.status(201).json(savedNotification.toJSON());
  }
});

module.exports = router;
