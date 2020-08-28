import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
import { IAnnouncement } from './interfaces';


const announcementSchema = new Schema(
  {
    _id: Number,
    title: String,
    content: String,
    author: String,
    date: Date,
    category: String,
    hidden: Boolean,
  },
  { _id: false }
);

announcementSchema.plugin(AutoIncrement);

announcementSchema.set('toJSON', {
  transform: (_document, returnedObject: IAnnouncement) => {
    returnedObject.id = returnedObject._id as number;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default model<IAnnouncement>('Announcement', announcementSchema);
