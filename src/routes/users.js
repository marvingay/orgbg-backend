const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.delete('/:displayName', (req, res) => {
  await User.findOneAndDelete({ displayName: req.params.displayName });
  return res.status(204).json({ msg: "Account Deleted" });
})

module.exports = router;