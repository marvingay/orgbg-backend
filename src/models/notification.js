const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

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

notificationSchema.plugin(AutoIncrement, { id: 'notifications' });

notificationSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.user;
  },
});

const Notification = model('Notification', notificationSchema);

module.exports = Notification;
