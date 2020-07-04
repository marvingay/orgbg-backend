const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../utils/config');
const authHelper = require('../utils/authHelper');
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
router.post('/', async (request, response) => {
  const token = request.body.idToken;
  const userID = await verify(token);
  console.log(userID);
  const userAccount = await User.findOne({ authID: userID });
  console.log(userAccount);
  if (userAccount) {
    // check if user exists -> sign token
    const user = {
      authID: userAccount.authID,
      displayName: userAccount.displayName,
      id: userAccount._id,
    };

    const webToken = jwt.sign(user, config.SECRET);
    response.cookie('webToken', webToken, { httpOnly: true });

    response.status(200).send({ webToken, displayName: user.displayName });
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

    response.cookie('webToken', webToken, { httpOnly: true });
    response.status(201).send({ webToken, displayName: user.displayName });
  }
});

// Update User Information Route
router.put('/', async (request, response) => {
  const body = request.body;

  console.log(body);
  if (!body.currentName.startsWith('ORGBG')) {
    // only new accounts can use this route
    return response.status(401).json({ error: 'Request Denied' });
  }

  const updateUser = await User.findOne({ displayName: body.currentName });
  console.log(updateUser);
  updateUser.displayName = body.updatedName;

  await updateUser.save();

  return response.json(updateUser.toJSON());
});

// GET: Check Auth route
router.get('/', (request, response) => {
  response.status(200).json({ success: true });
});

// POST: Logout route
router.post('/logout', (request, response) => {
  if (request.body.action === 'v')
    return response.status(200).json({ message: 'success' });
  else return response.status(400);
});

module.exports = router;
