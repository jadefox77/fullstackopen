import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls createBlog with correct details when form is submitted', async () => {
  const mockCreateBlog = vi.fn()

  render(<BlogForm createBlog={mockCreateBlog} />)

  const user = userEvent.setup()

  const inputs = screen.getAllByRole('textbox')

  // fill inputs
  await user.type(inputs[0], 'Test Title')
  await user.type(inputs[1], 'Test Author')
  await user.type(inputs[2], 'http://example.com')


  const button = screen.getByText('create')
  await user.click(button)

 
  expect(mockCreateBlog).toHaveBeenCalledTimes(1)

  
  expect(mockCreateBlog).toHaveBeenCalledWith({
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://example.com'
  })
})