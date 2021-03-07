const request = require('supertest');

const app = require('../src/app');
const Task = require('../src/models/task');
const {
  newUser,
  existingUser,
  nonExistingUser,
  setupDatabase,
  secondUser,
  firstTask,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should be able to create task', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
    .send({ description: 'From test' })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test('Should be able to get all tasks of a user', async () => {
  const { body } = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
    .send()
    .expect(200);

  expect(body).toHaveLength(2);
});

test('Should not allow second user to delete task of first user', async () => {
  await request(app)
    .delete(`/tasks/${firstTask._id}`)
    .set('Authorization', `Bearer ${secondUser.tokens[0].token}`)
    .send()
    .expect(404);

  const task = Task.findById(firstTask._id);
  expect(task).not.toBeNull();
});
