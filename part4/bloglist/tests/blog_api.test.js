const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'Adrian Title 1',
    author: 'Adrian 1',
    url: 'none ',
    likes: 1,
  },
  {
    title: 'Adrian Title 2',
    author: 'Adrian 2',
    url: 'none ',
    likes: 1,
  },
];

beforeEach(async function () {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test.only('blogs are returned as json', async function () {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test.only('unique identifier property of the blog posts is named id', async function () {
  const response = await api.get('/api/blogs');
  const blogs = response.body;
  const firstBlog = blogs[0];

  assert.strictEqual(firstBlog.hasOwnProperty('id'), true);
});

test.only('saving a blog post works fine', async function () {
  const newBlog = {
    title: 'Adrian Title 3',
    author: 'Adrian 3',
    url: 'none ',
    likes: 1,
    userId: '6702a9bc3c34a18196e72375',
  };

  const TOKEN = 'enough about the exercise';

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  const titles = response.body.map((blog) => blog.title);

  assert(titles.includes('Adrian Title 3'));
});

test.only('saving a blog without likes is saved with likes: 0', async function () {
  const newBlog = {
    title: 'Adrian Title 3',
    author: 'Adrian 3',
    url: 'none ',
    userId: '6702a9bc3c34a18196e72375',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const response = await api.get('/api/blogs');
  const lastAddedBlog = response.body[response.body.length - 1];

  assert.strictEqual(newBlog.hasOwnProperty('likes'), false);
  assert.strictEqual(lastAddedBlog.likes, 0);
});

test.only('saving a blog without title returns 400', async function () {
  const newBlog = {
    author: 'Adrian 3',
    likes: 0,
    url: 'none ',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

test.only('saving a blog without urls returns 400', async function () {
  const newBlog = {
    title: 'Adrian Title 3',
    author: 'Adrian 3',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

test.only('saving a blog pwithout token returns 401', async function () {
  const newBlog = {
    title: 'Adrian Title 3',
    author: 'Adrian 3',
    url: 'none ',
    likes: 1,
    userId: '6702a9bc3c34a18196e72375',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/);
});

test.only('updating blog succeeds with valid data', async () => {
  const response = await api.get('/api/blogs');
  const notesAtStart = response.body;
  const noteToUpdate = notesAtStart[1];
  noteToUpdate.likes = 1000;

  await api
    .put(`/api/blogs/${noteToUpdate.id}`)
    .send(noteToUpdate)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response2 = await api.get('/api/blogs');
  const notesAtEnd = response2.body;
  assert.equal(notesAtEnd[1].likes, 1000);
});

test.only('delete blog succeeds with status code 204 if id is valid', async function () {
  const response = await api.get('/api/blogs');
  const notesAtStart = response.body;
  const noteToDelete = notesAtStart[0];

  await api.delete(`/api/blogs/${noteToDelete.id}`).expect(204);

  const response2 = await api.get('/api/blogs');
  const notesAtEnd = response2.body;

  assert.strictEqual(notesAtEnd.length, notesAtStart.length - 1);

  const titles = notesAtEnd.map((blog) => blog.title);
  assert(!titles.includes(noteToDelete.title));
});

after(async () => {
  await mongoose.connection.close();
});
