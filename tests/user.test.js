const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');
const {
  newUser,
  existingUser,
  nonExistingUser,
  setupDatabase,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create user on signup', async () => {
  const response = await request(app).post('/users').send(newUser);
  const user = await User.findById(response.body.user._id);

  expect(user._id).not.toBeNull();
  expect(response.body).toMatchObject({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe(newUser.password);
});

test('Should be able to login in existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: existingUser.email,
    password: existingUser.password,
  });

  const user = await User.findById(response.body.user._id);
  expect(user._id).not.toBe(null);
  expect(user.tokens[1].token).toBe(existingUser.tokens[0].token);
});

test('Should not be able to login with wrong credentials', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: nonExistingUser.email,
      password: nonExistingUser.password,
    })
    .expect(400);
});

test('Should get user profile when given token is correct', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get user profile without token or with incorrect token', async () => {
  await request(app).get('/users/me').send().expect(401);
});

test('Should be able delete user with valid token', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(existingUser._id);
  expect(user).toBeNull();
});

test('Should not be able delete user with invalid token or no token', async () => {
  await request(app).delete('/users/me').send().expect(401);
});

test('Should be able to insert/update avatar', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await User.findById(existingUser._id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should be able to update the name of a user', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
    .send({ name: 'Updated Name' })
    .expect(200);

  const user = await User.findById(existingUser._id);
  expect(user.name).toBe('Updated Name');
});

test('Should not be able to update non-existing field in the document', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${existingUser.tokens[0].token}`)
    .send({ location: 'Pala' })
    .expect(400);
});
