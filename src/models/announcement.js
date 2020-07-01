const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const announcementSchema = new Schema({
  title: String,
  content: String,
  author: String,
  date: Date,
  category: String,
  hidden: Boolean,
});

announcementSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Announcement = model('Announcement', announcementSchema);

module.exports = Announcement;
