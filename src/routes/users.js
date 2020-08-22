const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.delete('/:displayName', async (req, res) => {
  await User.findOneAndDelete({ displayName: req.params.displayName });

  res.cookie('webToken', webToken, {
    expires: new Date(Date.now() - 10000),
    httpOnly: true,
  });
  res.ookie('webToken');
  return res.status(204).json({ msg: 'Account Deleted' });
});

module.exports = router;
