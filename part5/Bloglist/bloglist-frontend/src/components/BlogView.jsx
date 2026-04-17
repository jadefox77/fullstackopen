import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const BlogCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin: 10px auto;
  width: 500px;
  background: #fff;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
`

const Info = styled.div`
  margin-top: 8px;
  font-size: 14px;
`

const Button = styled.button`
  margin-top: 8px;
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background: #1976d2;
  color: white;
  cursor: pointer;
`

const Author = styled.div`
  color: #776f6f;
  font-size: 14px;
`

const DangerButton = styled(Button)`
  background: #d32f2f;
`


const BlogView = ({ blogs, handleLike, handleDelete, user }) => {
  const { id } = useParams()

  const blog = blogs.find(b => b.id === id)

  if (!blog) return null

  return (
    <div>
     
      <h2><Title>{blog.title}</Title> <Author> by {blog.author}</Author></h2>
      
      <div>{blog.url}</div>

      <div>
        likes {blog.likes}

        {user && (
          <button onClick={() => handleLike(blog)}>
            like
          </button>
        )}
      </div>

      <div>{blog.user?.name}</div>

      {user && blog.user?.username === user.username && (
        <DangerButton onClick={() => handleDelete(blog)}>
          remove
        </DangerButton>
      )}
    </div>
  )
}

export default BlogView