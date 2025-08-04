// server/models/User.js
const mongoose = require('mongoose');

// This is the "form" or "shape" of a User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Name must be provided
  },
  email: {
    type: String,
    required: true,
    unique: true,    // No two users can have same email
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true  // Automatically saves createdAt and updatedAt
});

// We are creating a model named 'User' using this shape
const User = mongoose.model('User', userSchema);

// Export this model so other files can use it
module.exports = User;
