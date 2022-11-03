'use strict';

//;/  (O_O) /;//
const jwt = require('jsonwebtoken');

//--------- DOTENV Config -------------//
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// -----------APP USING EXPRESS & JSON -------------//
const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//------------- ERROR HANDLING -------------//

const notFoundHandler = require('./src/handlers/error404');
const errorHandler = require('./src/handlers/error500');


//----------- VERIFICATION-AUTH0 --------------//

const verifyUser = require('./src/Auth/auth');

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
const USER = require('./src/models/user');


app.get('/', handleGetAlltodos);


//------TODO ENDPOINTS ------ //
app.post('/todo', handlePostTodo);
app.delete('/todo/:id', handleDeleteTodo)
app.put('/todo/:id', handleUpdateTodo);
app.use(verifyUser);

//------USER ENDPOINTS ------ //
app.post('/user', async (req, res) => {
  console.log('req', req.user)
  const user = req.user;
  const newUser = await handleGetUser(user);
  const status = newUser ? 200 : 403;
  console.log('token', newUser)
  res.status(status).send({ token: req.token, user: newUser });

});


//-------------------- TODO CRUD------------------//
async function handleGetAlltodos(req, res) {
  try {
    const todo = await TODO.find();

    res.status(200).send(todo);
  } catch (error) {
    console.error(error);
    res.status(400).send('Could not find todo\'s');
  }
}


async function handlePostTodo(req, res) {
  console.log('STUFF INSIDE!!', req.body)
  try {
    const findTodo = await TODO.findOne({ ...req.body, text: req.body.text, assignee: req.body.assignee });
    if (!findTodo) {
      const newTodo = await TODO.create({ ...req.body, text: req.body.text, assignee: req.body.assignee });
    }

    res.status(204).send("Todo was succussfully added");
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function handleDeleteTodo(req, res) {
  console.log('DELETED::', req.params)
  const { id } = req.params;
  try {
    const todo = await TODO.findOne({ _id: id });
    if (!todo) res.status(400).send('unable to delete todo');
    else {
      await TODO.findByIdAndDelete(id);
      res.status(204).send('todo deleted');
    }
  } catch (e) {
    res.status(500).send('server error');
  }
}


async function handleUpdateTodo(req, res) {
  console.log('UPDATED!!::', req.params)
  try {
    const updateTODO = await TODO.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(updateTODO);
  } catch (e) {
    res.status(500).send('servere error');
  }
}


//----------------- USER CRUD -------------------//



// ROLES FOR USERS
const roles = {
  admin: ['create', 'read', 'update', 'delete'],
  editor: ['read', 'update', 'delete'],
  writer: ['read', 'update'],
  guest: ['read'],
};

async function handleGetUser(search) {
  console.log('___________!', search);

  const checkUser = await USER.find()
  const userDatabase = checkUser.filter(u => {
    return u.email === search.email;
  })[0];

  if (userDatabase === undefined) {

    console.log('here here here ', search)

    const userData = {
      userName: search.given_name,
      lName: search.family_name,
      email: search.email,
      userType: roles.guest
    }
    const newUser = await USER.create({ ...userData })

    console.log('pleaseOhplease', newUser)

    return { username: newUser.userName, userType: newUser.userType }
  } else {

    console.log('AAAHHH', userDatabase)

    let user = null;
    if (userDatabase) {
      const newUserInfo = { username: userDatabase.userName, userType: userDatabase.userType };
      user = newUserInfo;
      console.log('Bro....===>', user)
    }
    return user;
  }

}



app.get('/', (request, response) => {
  response.send(' Yo?!?!?!    Am I ALIVE????  ');
});

app.get('*', notFoundHandler);

// Error stuff
app.use(errorHandler);



app.listen(PORT, () => console.log(`listening on ${PORT}`));
