const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.delete('/:displayName', async (req, res) => {
  await User.findOneAndDelete({ displayName: req.params.displayName });

  res.clearCookie('webToken', { domain: 'localhost', path: '/' });
  return res.status(204).json({ msg: 'Account Deleted' }).redirect('/');
});

module.exports = router;
