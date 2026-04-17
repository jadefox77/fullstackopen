import { useState } from 'react'
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
`

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <h2>create new blog</h2>
      <Form onSubmit={addBlog}>
       <div>
  <Label htmlFor="title">title</Label>
  <Input
    id="title"
    value={title}
    onChange={({ target }) => setTitle(target.value)}
  />
</div>

<div>
  <Label htmlFor="author">author</Label>
  <Input
    id="author"
    value={author}
    onChange={({ target }) => setAuthor(target.value)}
  />
</div>

<div>
  <Label htmlFor="url">url</Label>
  <Input
    id="url"
    value={url}
    onChange={({ target }) => setUrl(target.value)}
  />
</div>
        <Button type="submit">create</Button>
      </Form>
    </div>
  )
}

export default BlogForm