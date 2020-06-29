const express = require('express');
const router = express.Router();
const config = require('../utils/config');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.CLIENT_ID);

const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userID = payload['sub'];
};

router.post('/', async (request, response) => {
  const token = request.body.idToken;
  await verify(token);
  console.log("Success");
});


module.exports = router;
