const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const User = require('../models/user');

// TODO: GET User Notifcations

router.post('/', async (request, response) => {
  const { body } = request;
  // If User request, check action
  if (body.action === 'GET') {
    const notifications = await Notification.find({ user: body.user });
    return response.status(200).json({ notifications });
  }
  // TODO: POST Notification from 'admin' role.
  if (body.action === 'POST') {
    const notification = new Notification({
      ...body.payload,
    });

    const savedNotification = await notification.save();
    return response.status(201).json({ savedNotification });
  }
});

module.exports = router;
