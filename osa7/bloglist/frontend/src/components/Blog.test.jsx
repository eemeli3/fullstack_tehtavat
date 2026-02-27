import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('<Blog /> renders content title', () => {
  const blog = {
    title: 'A new blog',
    author: 'Aatu Author',
    url: 'https://url/url',
    likes: 10,
    user: {
      username: 'username123',
      name: 'Matti Meikäläinen'
    },
    id: '2fa342341234dfa341',
  }

  const userId = blog.user

  const func = () => console.log('Function called')

  render(<Blog blog={blog} likeBlog={func} removeBlog={func} userId={userId} />)

  const element = screen.getByText(blog.title, { exact: false })
  expect(element).toBeDefined()
})

test('<Blog /> renders likes, url, and user', async () => {
  const user = userEvent.setup()

  const blog = {
    title: 'A new blog',
    author: 'Aatu Author',
    url: 'https://url/url',
    likes: 10,
    user: {
      username: 'username123',
      name: 'Matti Meikäläinen'
    },
    id: '2fa342341234dfa341',
  }

  const userId = blog.user

  const func = () => console.log('Function called')

  render(<Blog blog={blog} likeBlog={func} removeBlog={func} userId={userId} />)

  const viewButton = screen.getByText('view')

  await user.click(viewButton)

  const elementLikes = screen.getByText(blog.likes, { exact: false })
  const elementUrl = screen.getByText(blog.url, { exact: false })
  const elementUser = screen.getByText(blog.user.name, { exact: false })
  expect(elementLikes).toBeDefined()
  expect(elementUrl).toBeDefined()
  expect(elementUser).toBeDefined()
})

test('liking blog calls likeBlog function', async () => {
  const user = userEvent.setup()

  const blog = {
    title: 'A new blog',
    author: 'Aatu Author',
    url: 'https://url/url',
    likes: 10,
    user: {
      username: 'username123',
      name: 'Matti Meikäläinen'
    },
    id: '2fa342341234dfa341',
  }

  const userId = blog.user

  const func = () => console.log('Function called')

  const likeBlog = vi.fn()

  render(<Blog blog={blog} likeBlog={likeBlog} removeBlog={func} userId={userId} />)

  const viewButton = screen.getByText('view')

  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(likeBlog.mock.calls).toHaveLength(2)
})