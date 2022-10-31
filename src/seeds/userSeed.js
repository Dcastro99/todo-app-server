require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

const user = require('../models/user');



const seed = async () => {
  await user.create({
    userName: 'Han',
    lName: 'Solo',
    email: 'solo.shot.first.2022@gmail.com',
    userType: ['read', 'update']
  });
  console.log('Seeded database!');

  mongoose.disconnect();
};
seed();
