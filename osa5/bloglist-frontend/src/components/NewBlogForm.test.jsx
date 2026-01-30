import { render, screen } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

test('<NewBlogForm /> calls createBlog with correct information', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const blog = {
    title: 'A new blog',
    author: 'Aatu Author',
    url: 'https://url/url',
  }

  render(<NewBlogForm blog={blog} createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title', { exact: false })
  const authorInput = screen.getByLabelText('Author', { exact: false })
  const urlInput = screen.getByLabelText('url', { exact: false })
  const createButton = screen.getByText('create')
  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
  expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
  expect(createBlog.mock.calls[0][0].url).toBe(blog.url)
})