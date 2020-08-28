import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
import { IMessage } from './interfaces';


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

AutoIncrement(messageSchema);
messageSchema.plugin(AutoIncrement, { id: 'messages' });

messageSchema.set('toJSON', {
  transform: (_document, returnedObject: IMessage) => {
    returnedObject.id = returnedObject._id as number;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default model<IMessage>('Message', messageSchema);
