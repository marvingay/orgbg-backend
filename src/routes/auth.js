const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
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
router.post('/', async (request, response) => {
  const token = request.body.idToken;
  const userID = await verify(token);
  console.log(userID);
  const userAccount = await User.findOne({ AuthID: userID });
  if (userAccount) {
    // check if user exists -> sign token
    const user = {
      displayName: user.displayName,
      id: user._id,
    };

    const webToken = jwt.sign(user, config.SECRET);

    response.status(200).send({ webToken, displayName: user.displayName });
  } else {
    // if user does not exist, create user
    const user = new User({
      AuthID: userID,
      displayName: `New${new Date().toLocaleString}`,
      role: 'member',
    });

    await user.save();

    response.status(201);
  }
});

module.exports = router;
