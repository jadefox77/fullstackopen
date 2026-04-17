import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import { Navigate } from 'react-router-dom'
import styled from 'styled-components'


const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 20px auto;
`

const InputGroup = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
`

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const Button = styled.button`
  padding: 10px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: #45a049;
  }
`

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)


const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )}, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      if (user.expiresAt < Date.now()) {
      // token expired
        window.localStorage.removeItem('loggedBloglistAppUser')
        setUser(null)
      } else {
        setUser(user)
        blogService.setToken(user.token)
      }
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      const userWithExpiry = {
        ...user,
        expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
      }

      window.localStorage.setItem(
        'loggedBloglistAppUser',
        JSON.stringify(userWithExpiry)
      )

      blogService.setToken(user.token)
      setUser(userWithExpiry)

      setUsername('')
      setPassword('')
       navigate('/')
    } catch {
      setNotification({
        message: 'wrong username or password',
        type: 'error' })
    }
    setTimeout(() => setNotification(null), 5000)
  }


  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const loginForm = () => (
    <Form onSubmit={handleLogin}>
      <div>
        <Label>
          username
          <Input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Label>
      </div>
      <div>
        <Label>
          password
          <Input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Label>
      </div>
      <Button type="submit">login</Button>
    </Form>
  )


  const addBlog = async (blogObject) => {

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(prevBlogs => prevBlogs.concat(returnedBlog))

      setNotification({
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        type: 'success'
      })
      setTimeout(() => setNotification(null), 5000)
      navigate('/')
    }

    catch (error) {
      console.error('Error creating blog:', error)
      setNotification({
        message: 'Error creating blog',
        type: 'error'
      })
      setTimeout(() => setNotification(null), 5000)

    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user._id // important fix
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      setBlogs(blogs.map(b =>
        b.id === blog.id ? returnedBlog : b
      ))
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    )

    if (!confirmDelete) return

    try {
      await blogService.remove(blog.id)

      setBlogs(prevBlogs =>
        prevBlogs.filter(b => b.id !== blog.id)
      )

      setNotification({
        message: `Removed ${blog.title}`,
        type: 'success'
      })
      setTimeout(() => setNotification(null), 5000)
      navigate('/')
    } catch (error) {
      console.error('Error deleting blog:', error)
      setNotification({
        message: 'Error deleting blog',
        type: 'error'
      })
    }

    setTimeout(() => setNotification(null), 5000)
  }
 const padding = {
    padding: 5
  }

  return (
 
      <div>
         <Notification notification={notification} />

         
      <Link style={padding} to="/">blogs</Link>
      <Link style={padding} to="/create">new blog</Link>

       {user === null ? (
    <Link style={padding} to="/login">login</Link>
  ) : (
    <>
      <button onClick={handleLogout}>logout</button>
    </>
  )}
     
      <Routes>
        <Route path="/login" element={loginForm()} />
        <Route path="/" element={<div><h2>blogs</h2>
        <BlogList 
          blogs={blogs}
          handleLike={handleLike} 
          handleDelete={handleDelete} 
          user={user} />
        </div>} />
        <Route
          path="/blogs/:id"
          element={
      <BlogView
        blogs={blogs}
        handleLike={handleLike}
        handleDelete={handleDelete}
        user={user}
      />
    }
  />
      <Route
       path="/create"
       element={
         user
          ? <BlogForm createBlog={addBlog} />
          : <Navigate to="/login" />
  }
/>
      </Routes>
     </div>
  )
}

export default App