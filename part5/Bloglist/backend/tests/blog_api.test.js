const assert = require('node:assert')
const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

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
    .send({
      username: 'root',
      password: 'secret'
    })

  token = loginResponse.body.token

  const user = await User.findOne({ username: 'root' })

  const blogsWithUser = helper.initialBlogs.map(blog => ({
    ...blog,
    user: user._id
  }))

  await Blog.insertMany(blogsWithUser)
})

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.status, 200)
  assert.match(response.headers['content-type'], /application\/json/)
})

test('all blogs are returned', async () => {
  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('blogs have id property', async () => {
  const blogs = await helper.blogsInDb()
  blogs.forEach(blog => assert.ok(blog.id))
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5
  }

  const postResponse = await api
  .post('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
  .send(newBlog)
  .expect(201)

  assert.strictEqual(postResponse.status, 201)
  assert.match(postResponse.headers['content-type'], /application\/json/)

  const blogs = await helper.blogsInDb()
  const titles = blogs.map(b => b.title)
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
  assert.ok(titles.includes('New Test Blog'))
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without Likes',
    author: 'Test Author',
    url: 'https://testblog.com'
  }

  const response = await api
  .post('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
  .send(newBlog)
  .expect(201)

  assert.strictEqual(response.status, 201)

  const blogs = await helper.blogsInDb()
  const addedBlog = blogs.find(b => b.title === 'Blog without Likes')
  assert.strictEqual(addedBlog.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = { author: 'No Title', url: 'https://notitle.com', likes: 5 }
  const response = await api
  .post('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
  .send(newBlog)
  .expect(400)

  assert.strictEqual(response.status, 400)

  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = { title: 'No URL', author: 'Test Author', likes: 3 }
  const response = await api
  .post('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
  .send(newBlog)
  .expect(400)
  assert.strictEqual(response.status, 400)

  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

 await api
  .delete(`/api/blogs/${blogToDelete.id}`)
  .set('Authorization', `Bearer ${token}`)
  .expect(204)
    

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(
    blogsAtEnd.length,
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(b => b.title)

  assert.ok(!titles.includes(blogToDelete.title))
})

after(async () => {
  await mongoose.connection.close()
})