const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  subject: String,
  body: String,
  seen: Boolean,
  date: Date,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Message = model('Message', messageSchema);

module.exports = Message;
