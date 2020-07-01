const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');

// TODO: Authorization
router.get('/', async (_request, response) => {
  const announcements = await Announcement.find({});
  response.json(announcements.map((announcement) => announcement.toJSON()));
});

router.post('/', async (request, response) => {
  const announcement = new Announcement({
    ...request.body,
    date: new Date(),
  });

  const savedAnnouncement = await announcement.save();
  response.status(201).json(savedAnnouncement.toJSON());
});

router.put('/:id', async (request, response) => {
  const originalAnnouncement = router.get('/:id');
  const announcement = {
    ...originalAnnouncement,
    ...request.body,
  };
  const updatedAnnouncement = await Announcement.findByIdAndUpdate(
    request.params.id,
    announcement
  );

  response.json(updatedAnnouncement.toJSON());
});

router.delete('/:id', async (request, response) => {
  await Announcement.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = router;
