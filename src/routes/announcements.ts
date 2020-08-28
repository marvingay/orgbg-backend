import express from 'express';
const router = express.Router();
import Announcement from '../models/announcement';

router.get('/', async (_req, res) => {
  const announcements = await Announcement.find({});
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json(announcements.map((announcement) => announcement.toJSON()));
});

router.post('/', async (req, res) => {
  const announcement = new Announcement({
    ...req.body,
    date: new Date(),
  });

  const savedAnnouncement = await announcement.save();
  return res.status(201).json(savedAnnouncement.toJSON());
});
// ! Don't use this yet
// router.put('/:id', async (req, res) => {
//   const originalAnnouncement = router.get('/:id');
//   const announcement = {
//     ...originalAnnouncement,
//     ...req.body,
//   };
//   const updatedAnnouncement = await Announcement.findByIdAndUpdate(
//     req.params.id,
//     announcement
//   );

//   return res.json(updatedAnnouncement.toJSON());
// });

router.delete('/:id', async (req, res) => {
  await Announcement.findByIdAndRemove(req.params.id);
  return res.status(204).end();
});

export default router;
