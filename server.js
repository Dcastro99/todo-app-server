'use strict';

//;/  (O_O) /;//

//--------- DOTENV Config -------------//
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// -----------APP USING EXPRESS & JSON -------------//
const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());



//------------- ERROR HANDLING -------------//

const notFoundHandler = require('./src/handlers/error404');
const errorHandler = require('./src/handlers/error500');


//----------- VERIFICATION-AUTH0 --------------//

// const verifyUser = require('./src/Auth/auth');

//------------ MONG-DB -------------//

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});


//------------ MODELS FOR MONGO-DB -------------//

const TODO = require('./src/models/todo');

// Do not move line this line below <*>
// app.use(verifyUser);


app.get('/', handleGetAlltodos);

// NFT Functions
async function handleGetAlltodos(req, res) {
  try {
    const todo = await TODO.find();
    res.status(200).send(todo);
  } catch (error) {
    console.error(error);
    res.status(400).send('Could not find todo\'s');
  }
}


app.get('/', (request, response) => {
  response.send(' Yo?!?!?!    Am I ALIVE????  ');
});

app.get('*', notFoundHandler);

// Error stuff
app.use(errorHandler);



app.listen(PORT, () => console.log(`listening on ${PORT}`));
