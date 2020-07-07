const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('../app/').AutoIncrement;

const notificationSchema = new Schema(
  {
    _id: Number,
    type: String,
    message: String,
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  { _id: false }
);

notificationSchema.plugin(AutoIncrement);

const Notifcation = model('Notifcation', notificationSchema);

module.exports = Notifcation;
