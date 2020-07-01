const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  authID: { type: String, required: true, unique: true },
  displayName: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 16,
  },
  role: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

const User = model('User', userSchema);

module.exports = User;
