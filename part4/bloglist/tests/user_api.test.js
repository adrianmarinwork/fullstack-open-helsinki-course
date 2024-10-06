const bcrypt = require('bcrypt');
const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');

const User = require('../models/user');

const app = require('../app');

const api = supertest(app);

describe('when there is initially one user in db', function () {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async function () {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'AdrianMarin',
      name: 'Adrian',
      password: 'testtest',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails with proper status code and message if username already taken', async function () {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'root',
      name: 'AdrianMarin',
      password: 'secret',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/);

    const usersAtEnd = await User.find({});
    assert(result.body.error.includes('expected `username` to be unique'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper status code and message if password to short', async function () {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'root2',
      name: 'AdrianMarin',
      password: 'te',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/);

    const usersAtEnd = await User.find({});
    assert(
      result.body.error.includes('Password has to be atleast 3 characters long')
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
