const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');
const format = require('date-fns/format');

router.get('/', async (_request, response) => {
  const announcements = await Announcement.find({});
  return response.json(
    announcements.map((announcement) => announcement.toJSON())
  );
});

router.post('/', async (request, response) => {
  const announcement = new Announcement({
    ...request.body,
    date: format(new Date(), 'MM/dd/yy h:mm a O'),
  });

  const savedAnnouncement = await announcement.save();
  response.status(201).json(savedAnnouncement.toJSON());
});
// ! Don't use this yet
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
