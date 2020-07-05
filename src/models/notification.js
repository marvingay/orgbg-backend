const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('../app/');

const notificationSchema = new Schema(
  {
    _id: Number,
    type: String,
    message: String,
  },
  { _id: false }
);

notificationSchema.plugin(AutoIncrement);

const Notifcation = model('Notifcation', notificationSchema);

module.exports = Notifcation;
