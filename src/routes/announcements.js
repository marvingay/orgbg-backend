const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');

router.get('/', async (_req, res) => {
  const announcements = await Announcement.find({});
  res.status(200).json(announcements.toJSON());
});

router.post('/', (_req, res) => {
  res.send('POST announcement');
});

router.put('/:id', (_req, _res) => {
  console.log('UPDATE announcement');
});

router.delete('/:id', (_req, res) => {
  res.send('DELETE announcement');
});

module.exports = router;
