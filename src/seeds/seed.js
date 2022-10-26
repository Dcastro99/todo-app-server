require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

const todo = require('../models/todo');



const seed = async () => {
  await todo.create({
    text: 'Buy stuff!',
    assignee: 'Danny',
    complete: false,
    difficulty: 1
  });
  console.log('Seeded database!');

  mongoose.disconnect();
};
seed();