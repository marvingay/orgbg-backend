const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const messageSchema = new Schema(
  {
    _id: Number,
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
  },
  { _id: false }
);

messageSchema.plugin(AutoIncrement, { id: 'messages' });

messageSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.user;
  },
});

const Message = model('Message', messageSchema);

module.exports = Message;
