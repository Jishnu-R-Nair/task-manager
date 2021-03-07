const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Task = require('../../src/models/task');
const User = require('../../src/models/user');

const userId = new mongoose.Types.ObjectId();
const secondUserId = new mongoose.Types.ObjectId();

const newUser = {
  name: 'New User',
  email: 'newuser@test.com',
  password: 'poomonedinesha',
};

const existingUser = {
  _id: userId,
  name: 'Existing User',
  email: 'existinguser@test.com',
  password: 'savaarigirigirigiri',
  tokens: [
    {
      token: jwt.sign({ _id: userId }, process.env.JWT_SECRET),
    },
  ],
};

const secondUser = {
  _id: secondUserId,
  name: 'Second User',
  email: 'seconduser@test.com',
  password: 'ayyyoooooo',
  tokens: [
    {
      token: jwt.sign({ _id: secondUserId }, process.env.JWT_SECRET),
    },
  ],
};

const nonExistingUser = {
  name: 'Non Existing User',
  email: 'nonexistinguser@test.com',
  password: 'shambomahadeva',
};

const firstTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First Task',
  completed: false,
  owner: existingUser._id,
};

const secondTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second Task',
  completed: true,
  owner: existingUser._id,
};

const thirdTask = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third Task',
  completed: true,
  owner: secondUser._id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  await new User(existingUser).save();
  await new User(secondUser).save();
  await new Task(firstTask).save();
  await new Task(secondTask).save();
  await new Task(thirdTask).save();
};

module.exports = {
  newUser,
  existingUser,
  nonExistingUser,
  secondUser,
  setupDatabase,
  secondUser,
  firstTask,
};
