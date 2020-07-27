const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const User = require('../models/user');

// TODO: GET User Notifcations

router.post('/', async (req, res) => {
  const { body } = req;
  console.log(body);
  // read notifs, set notifs to seen
  if (body.action === 'READ') {
    const user = await User.findOne({ displayName: body.user });
    console.log(user);
    await Notification.updateMany({ user: user._id }, { read: true });
    console.log('This worked');
    return res.status(204).json({ message: 'Success' });
  }
  // If User req, check action
  if (body.action === 'GET') {
    const user = await User.findOne({ displayName: body.user });
    const notifications = await Notification.find({ user: user._id });
    console.log(notifications);
    return res.json(notifications.map((notification) => notification.toJSON()));
  }
  // TODO: POST Notification from 'admin' role.
  if (body.action === 'POST') {
    const notification = new Notification({
      ...body.payload,
    });

    const savedNotification = await notification.save();
    return res.status(201).json(savedNotification.toJSON());
  }
});

module.exports = router;
