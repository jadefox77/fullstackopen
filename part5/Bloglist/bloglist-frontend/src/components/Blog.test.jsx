import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Blog from './Blog'
import { BrowserRouter } from 'react-router-dom'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 10,
    user: {
      username: 'john',
      name: 'John Doe'
    }
  }

  render(
      <BrowserRouter>
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      user={blog.user}
    />
    </BrowserRouter>
  )


  expect(screen.getByText(/Test Blog/i)).toBeDefined()
  expect(screen.getByText(/John Doe/i)).toBeDefined()


  expect(screen.queryByText('http://example.com')).toBeNull()


  expect(screen.queryByText('likes 10')).toBeNull()
})


test('shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 10,
    user: {
      username: 'john',
      name: 'John Doe'
    }
  }

  render(
    <BrowserRouter>
      <Blog
        blog={blog}
        handleLike={() => {}}
        handleDelete={() => {}}
        user={blog.user}
      />
    </BrowserRouter>
  )

  const user = userEvent.setup()

  // find and click the view button
  const button = screen.getByText('view')
  await user.click(button)

  // now details should be visible
  expect(screen.getByText('http://example.com')).toBeInTheDocument()
  expect(screen.getByText(/likes 10/i)).toBeInTheDocument()
})


test('like button calls event handler twice when clicked twice', async () => {
    const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 10,
    user: {
      username: 'john',
      name: 'John Doe'
    }
  }

  const mockHandler = vi.fn()


    render(
      <BrowserRouter>
        <Blog
          blog={blog}
          handleLike={mockHandler}
          handleDelete={() => {}}
          user={blog.user}
        />
      </BrowserRouter>
    )
  


  const user = userEvent.setup()

   const viewButton = screen.getByText('view')
   await user.click(viewButton)

   const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

   expect(mockHandler).toHaveBeenCalledTimes(2)


})

test('unauthenticated user cannot see like or remove buttons', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 10,
    user: {
      username: 'john',
      name: 'John Doe'
    }
  }

  render(
    <BrowserRouter>
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      user={null} // 🔑 important
    />
    </BrowserRouter>
  )

  const userEventInstance = userEvent.setup()

  // expand details
  const button = screen.getByText('view')
  await userEventInstance.click(button)

  // buttons should NOT exist
  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})


test('non-owner sees only like button', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 10,
    user: {
      username: 'john',
      name: 'John Doe'
    }
  }

  const loggedUser = {
    username: 'someoneElse',
    name: 'Someone Else'
  }

  render(
    <BrowserRouter>
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      user={loggedUser}
    />
    </BrowserRouter>
  )

  const userEventInstance = userEvent.setup()

  const button = screen.getByText('view')
  await userEventInstance.click(button)

  // like exists
  expect(screen.getByText('like')).toBeInTheDocument()

  // delete does NOT
  expect(screen.queryByText('remove')).toBeNull()
})

test('creator sees delete button', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 10,
    user: {
      username: 'john',
      name: 'John Doe'
    }
  }

  const owner = {
    username: 'john',
    name: 'John Doe'
  }

  render(
    <BrowserRouter>
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      user={owner}
    />
    </BrowserRouter>
  )

  const userEventInstance = userEvent.setup()

  const button = screen.getByText('view')
  await userEventInstance.click(button)

  expect(screen.getByText('like')).toBeInTheDocument()
  expect(screen.getByText('remove')).toBeInTheDocument()
})