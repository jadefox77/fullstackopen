const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go to source",
    author: "Arto Hellas",
    url: "https://stackoverflow.com/questions/54115384/what-is-the-difference-between-const-and-let-in-javascript",
    likes: 12
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD0834.html",
    likes: 17
  }
]

const initialUsers = [
  { username: 'root', name: 'Superuser', passwordHash: 'hashedpassword' }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
 
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'http://example.com' })
  await blog.save()
  await Blog.deleteOne({ _id: blog._id })
  return blog._id.toString()
}



module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  initialUsers,
  usersInDb,
 
}