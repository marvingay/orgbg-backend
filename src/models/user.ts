import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IUser } from './interfaces';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  authID: { type: String, required: true },
  displayName: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 16,
  },
  role: { type: String, required: true },
});

userSchema.set('toJSON', {
  transform: (_document, returnedObject: IUser) => {
    returnedObject.id = returnedObject._id as string;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

userSchema.plugin(uniqueValidator);

export default model<IUser>('User', userSchema);

