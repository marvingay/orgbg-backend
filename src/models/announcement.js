const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const announcementSchema = new Schema(
  {
    _id: Number,
    title: String,
    content: String,
    author: String,
    date: String,
    category: String,
    hidden: Boolean,
  },
  { _id: false }
);

announcementSchema.plugin(AutoIncrement);

announcementSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Announcement = model('Announcement', announcementSchema);

module.exports = Announcement;
