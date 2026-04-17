const assert = require('node:assert')
const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper') // you'll want helper.initialUsers and helper.usersInDb()
const Blog = require('../models/blog')

const api = supertest(app)


let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'secret'
  }
    await api.post('/api/users').send(newUser)

    const loginResponse = await api
     .post('/api/login')
     .send({ username: newUser.username, password: newUser.password })
  token = loginResponse.body.token
  
})

test('users are returned as json', async () => {
  const response = await api.get('/api/users')
  assert.strictEqual(response.status, 200)
  assert.match(response.headers['content-type'], /application\/json/)
})

test('all users are returned', async () => {
  const users = await helper.usersInDb()
  assert.strictEqual(users.length, 1)
})

test('a valid user can be added', async () => {
  const newUser = {
    username: 'king',
    name: 'King',
    password: 'secret123'
  }

  const response = await api.post('/api/users').send(newUser)
  assert.strictEqual(response.status, 201)
  assert.match(response.headers['content-type'], /application\/json/)

  const users = await helper.usersInDb()
  const usernames = users.map(u => u.username)
  assert.strictEqual(users.length, helper.initialUsers.length + 1)
  assert.ok(usernames.includes('king'))
})

test('creation fails without username', async () => {
  const newUser = { name: 'NoUsername', password: 'secret123' }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)


  const users = await helper.usersInDb()
  assert.strictEqual(users.length, helper.initialUsers.length)
})

test('creation fails if password is too short', async () => {
  const newUser = { username: 'shortpass', name: 'Short', password: '12' }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const users = await helper.usersInDb()
  assert.strictEqual(users.length, helper.initialUsers.length)
})

test('adding a blog fails with 401 if token not provided', async () => {
  const newBlog = {
    title: 'Unauthorized',
    author: 'King',
    url: 'http://example.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})