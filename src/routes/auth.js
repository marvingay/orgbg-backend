const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Message = require('../models/message');
const Notification = require('../models/notification');
const config = require('../utils/config');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.CLIENT_ID);

// Google OAuth token verification helper
const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userID = payload['sub'];
  return userID;
};

// Sign-In route
router.post('/', async (req, res) => {
  const token = req.body.idToken;
  const userID = await verify(token);
  console.log(userID);
  const userAccount = await User.findOne({ authID: userID });
  if (userAccount) {
    // check if user exists -> sign token
    const user = {
      authID: userAccount.authID,
      displayName: userAccount.displayName,
      id: userAccount._id,
    };

    const webToken = jwt.sign(user, config.SECRET);
    res.cookie('webToken', webToken, { httpOnly: true });

    res.status(200).send({ webToken, displayName: user.displayName });
  } else {
    // if user does not exist, create user

    const user = new User({
      authID: userID,
      displayName: `ORGBG${Math.floor(Math.random() * 10000000)}`,
      role: 'member',
    });

    await user.save();

    const userForToken = {
      authID: userID,
      displayName: user.displayName,
      id: user._id,
    };

    const webToken = jwt.sign(userForToken, config.SECRET);

    const message = new Message({
      body: 'Welcome to ORG Battleground!',
      seen: false,
      date: new Date(),
      sender: '5f343667aa7ef43fc873d315',
      recipient: user._id,
    });

    const notification = new Notification({
      type: 'message',
      message: 'Welcome to ORG Battleground!',
      read: false,
      user: user._id,
    });

    await message.save();
    await notification.save();

    res.cookie('webToken', webToken, { httpOnly: true });
    return res
      .status(201)
      .redirect('/')
      .send({ webToken, displayName: user.displayName });
  }
});

// Update User Information Route
router.put('/', async (req, res) => {
  const body = req.body;

  if (!body.currentName.startsWith('ORGBG')) {
    // only new accounts can use this route
    return res.status(401).json({ error: 'Request Denied' });
  }

  const updateUser = await User.findOne({ displayName: body.currentName });
  updateUser.displayName = body.updatedName;

  await updateUser.save();

  return res.json(updateUser.toJSON());
});

// ! DUNUSED - GET: Check Auth route
router.get('/', (req, res) => {
  res.status(200).json({ success: true });
});

// GET: Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('webToken', { domain: 'localhost', path: '/' });
  res.status(200).send({ message: 'Successfully logged out.' });
});

module.exports = router;
