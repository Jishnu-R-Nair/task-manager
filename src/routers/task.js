const express = require('express');

const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', auth, async (req, res) => {
  const match = {};

  if (req.query.completed) match.completed = JSON.parse(req.query.completed);

  try {
    await req.user.populate({ path: 'tasks', match }).execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    console.log(error);
    res.send(500).send();
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    console.log(req.user._id);
    if (!task) return res.status(404).send();

    res.send(task);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body || {});
  const allowedUpdates = ['description', 'completed'];

  const isValidUpdateOperation = updates.every((u) =>
    allowedUpdates.includes(u)
  );

  if (!isValidUpdateOperation)
    return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) return res.status(404).send();

    updates.forEach(
      (updateField) => (task[updateField] = req.body[updateField])
    );

    await task.save();

    res.send(task);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) return res.status(404).send();

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
