const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const { userExtractor, tokenExtractor } = require('../utils/middleware');


blogsRouter.get('/', async(req, res, next) => {
  try {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1})
  res.json(blogs.map(blog => blog.toJSON()));
} catch (error) {
  next(error)
}
});


blogsRouter.post('/', userExtractor, tokenExtractor, async (req, res, next) => {
  try {
  const body = req.body
  const user = req.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog) 
} catch (error) {
    next(error) 
  }
})

blogsRouter.delete('/:id', userExtractor, tokenExtractor, async (req, res, next) => {
  try {
    const user = req.user

    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({error: 'blog not found'})

    if (blog.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedBlog) {
      return res.status(404).end()
    }

    res.json(updatedBlog)

  } catch (error) {
    next(error)
  }
})



module.exports = blogsRouter;

