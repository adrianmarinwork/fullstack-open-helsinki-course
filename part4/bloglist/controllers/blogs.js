const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  let newBlogRequest = request.body;

  if (!newBlogRequest.title || !newBlogRequest.url) {
    return response
      .status(400)
      .json({ error: 'Either title or url are mandatory' });
  }

  if (!newBlogRequest.likes) {
    newBlogRequest.likes = 0;
  }

  const user = await User.findById(request.user.id);
  newBlogRequest.user = user.id;

  const blog = new Blog(newBlogRequest);

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogsRouter.put('/:id', async function (request, response, next) {
  const body = request.body;

  const blog = {
    title: body.title,
    likes: body.likes,
    author: body.author,
    url: body.url,
  };

  const updatedPerson = await Blog.findByIdAndUpdate(
    request.params.id,
    { ...blog },
    { new: true }
  );

  response.status(201).json(updatedPerson);
});

blogsRouter.delete('/:id', async (request, response) => {
  const userId = request.user.id;
  const id = request.params.id;
  const blog = await Blog.findById(id);

  if (blog.user.toString() !== userId.toString()) {
    return response
      .status(401)
      .json({ error: 'User is not the owner of the blog' });
  }

  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

module.exports = blogsRouter;
