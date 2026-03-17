const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'customer', 'user'],  // Allow 'user' as a valid role
    default: 'user',
  },
});

// Check if the model already exists to avoid the "overwrite" error
module.exports = mongoose.models.User || mongoose.model('User', userSchema);