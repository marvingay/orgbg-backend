import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
import { INotification } from './interfaces';

const notificationSchema = new Schema(
  {
    _id: Number,
    type: String,
    message: String,
    read: Boolean,
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  { _id: false }
);

AutoIncrement(notificationSchema);
notificationSchema.plugin(AutoIncrement, { id: 'notifications' });

notificationSchema.set('toJSON', {
  transform: (_document, returnedObject: INotification) => {
    returnedObject.id = returnedObject._id as number;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.user;
  },
});

export default model<INotification>('Notification', notificationSchema);
