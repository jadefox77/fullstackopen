const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (req, res) => {
    
  const users = await User
    .find({}).populate('blogs', {title: 1, author: 1, url: 1, like: 1})
  res.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({ error: 'username is required' })
  }

  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter