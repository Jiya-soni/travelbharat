const mongoose = require("mongoose");

// This defines what every "User" document looks like in the database.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true   // no two users can register with the same email
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  favorites: {
    type: [String],   // a list of place IDs this user has saved
    default: []
  }
}, {
  timestamps: true   // automatically records when each user account was created
});

module.exports = mongoose.model("User", userSchema);