const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const User = require('../models/user');

// TODO: GET User Notifcations

router.post('/', async (req, res) => {
  const { body } = req;
  // If User req, check action
  if (body.action === 'GET') {
    const notifications = await Notification.find({ user: body.user });
    return res.status(200).json({ notifications });
  }
  // TODO: POST Notification from 'admin' role.
  if (body.action === 'POST') {
    const notification = new Notification({
      ...body.payload,
    });

    const savedNotification = await notification.save();
    return res.status(201).json({ savedNotification });
  }
});

module.exports = router;
