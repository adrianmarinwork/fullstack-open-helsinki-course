const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  let newUser = request.body;

  if (newUser?.password?.length < 3) {
    return response
      .status(400)
      .json({ error: 'Password has to be atleast 3 characters long' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds);
  newUser.passwordHash = passwordHash;

  const user = new User(newUser);
  const result = await user.save();
  response.status(201).json(result);
});

module.exports = usersRouter;
