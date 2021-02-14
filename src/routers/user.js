const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.send(500).send();
  }
});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).send();

    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'age', 'password'];
  const isValidUpdateOperation = updates.every((u) =>
    allowedUpdates.includes(u)
  );

  if (!isValidUpdateOperation)
    return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const user = await User.findById(req.params.id);

    updates.forEach(
      (updateField) => (user[updateField] = req.body[updateField])
    );

    await user.save();

    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });

    if (!user) return res.status(404).send();

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
