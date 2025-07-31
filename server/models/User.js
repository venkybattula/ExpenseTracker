const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // ensures no leading/trailing whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true // enforces unique email
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true }); // adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
