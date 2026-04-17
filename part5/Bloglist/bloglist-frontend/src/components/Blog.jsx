import { useState } from 'react'
import { Link } from 'react-router-dom'


const Blog = ( { blog, handleLike, handleDelete, user } ) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const showDelete =
  user &&
  blog.user &&
  (blog.user.username === user.username)

  return (
    <div className='blog' style={blogStyle}>
      <div>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className='blog-details'>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            {user && (<button onClick={() => handleLike(blog)}>like</button>)}
          </div>
          <div>{blog.user?.name || blog.user?.username}</div>


          {showDelete && (
            <button onClick={() => handleDelete(blog)}>
    remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog