import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import { CLIENT_ID, SECRET } from '../utils/config';
import User from '../models/user';
import Message from '../models/message';
import Notification from '../models/notification';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(CLIENT_ID);

// Google OAuth token verification helper
const verify = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userID = payload?.sub;
  return userID;
};

// Sign-In route
router.post('/', async (req, res) => {
  const token = req.body.idToken;
  const userID = await verify(token);
  const userAccount = await User.findOne({ authID: userID });
  if (userAccount) {
    // check if user exists -> sign token
    const user = {
      authID: userAccount.authID,
      displayName: userAccount.displayName,
      id: userAccount._id,
    };

    const webToken = jwt.sign(user, SECRET);
    res.cookie('webToken', webToken, { httpOnly: true });

    return res.status(200).send({ webToken, displayName: user.displayName });
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

    const webToken = jwt.sign(userForToken, SECRET);

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
    return res.status(201).send({ webToken, displayName: user.displayName });
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
  if (updateUser) {
    updateUser.displayName = body.updatedName;
    await updateUser.save();
    return res.json(updateUser.toJSON());
  }

  return res.status(401).json({ error: 'Request Denied' });

});

// ! DUNUSED - GET: Check Auth route
// router.get('/', (req, res) => {
//   res.status(200).json({ success: true });
// });

// GET: Logout route
router.get('/logout', (_req, res) => {
  res.clearCookie('webToken', { domain: 'localhost', path: '/' });
  return res.status(200).send({ message: 'Successfully logged out.' });
});

export default router;
