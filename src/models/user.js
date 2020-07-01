const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

userSchema.plugin(uniqueValidator);

const User = model('User', userSchema);

module.exports = User;
