const mongoose = require('mongoose');

const { Schema } = mongoose;

const todoSchema = new Schema({
  text: String,
  assignee: String,
  complete: Boolean,
  difficulty: Number
});

const TODO = mongoose.model('todo', todoSchema);

module.exports = TODO;
