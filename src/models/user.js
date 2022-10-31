const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: String,
  lName: String,
  email: String,
  userType: Array
});

const USER = mongoose.model('users', userSchema);

module.exports = USER;
