// CRUD

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) return console.log('Unable to connect to database');

    console.log('Connected to database');

    const db = client.db(databaseName);

    // db.collection('users').findOne(
    //   { _id: new ObjectID('60215972f51cd96091167762') },
    //   (error, user) => {
    //     if (error) return console.log('Unable to find one');

    //     console.log(user);
    //   }
    // );

    // db.collection('users')
    //   .find({ age: 27 })
    //   .toArray((error, users) => {
    //     console.log('users', users);
    //   });

    // db.collection('users')
    //   .find({ age: 27 })
    //   .count((error, count) => {
    //     console.log('users count', count);
    //   });

    // db.collection('tasks').findOne(
    //   { _id: new ObjectID('602177c3038eaf63fce59d1e') },
    //   (error, task) => {
    //     console.log('task by id', task);
    //   }
    // );

    // db.collection('tasks')
    //   .find({ completed: false })
    //   .toArray((error, tasks) => {
    //     console.log('tasks', tasks);
    //   });

    // const updatePromise = db
    //   .collection('users')
    //   .updateOne(
    //     { _id: new ObjectID('60215972f51cd96091167762') },
    //     { $inc: { age: 1 } }
    //   );

    // updatePromise
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log(error));

    // db.collection('tasks')
    //   .updateMany({ completed: false }, { $set: { completed: true } })
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log(error));

    // db.collection('users')
    //   .deleteMany({ age: 26 })
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log(error));

    // db.collection('tasks')
    //   .deleteOne({ description: 'kjdhfkjdhfkjhdfkj' })
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log(error));
  }
);
