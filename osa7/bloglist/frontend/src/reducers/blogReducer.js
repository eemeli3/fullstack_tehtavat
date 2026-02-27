import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { notify } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload)
    },
    updateBlogLikes(state, action) {
      return state.map((blog) => blog.id === action.payload.id ? action.payload : blog).sort((a, b) => b.likes - a.likes)
    }
  }
})

const { setBlogs, deleteBlog, updateBlogLikes } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }
}

export const createBlog = ({ user, blog }) => {
  return async (dispatch) => {
    try {
      await blogService.create( blog, user)
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
      dispatch(notify({
        message: `${blog.title} by ${blog.author} added`,
        isGood: true,
      }))
    } catch {
      dispatch(notify({
        message: 'Failed to add blog',
        isGood: false,
      }))
    }
  }
}

export const removeBlog = (blog, user) => {
  // function for removing a blog
  return async (dispatch) => {
    try {
      if (
        !window.confirm(
          `Remove blog ${blog.title} by ${blog.author}`,
        )
      ) {
        return
      }
      await blogService.remove(
        blog.id,
        user,
      )
      dispatch(deleteBlog(blog.id))
      dispatch(notify({
        message: `${blog.title} by ${blog.author} removed`,
        isGood: true,
      }))
    } catch {
      dispatch(notify({
        message:
          'failed to remove blog',
        isGood: false,
      }))
    }
  }
}

export const likeBlog = (blog) => {
  // funcion for liking a blog
  return async (dispatch) => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 }
      await blogService.like(updatedBlog, blog.id)
      dispatch(updateBlogLikes(updatedBlog))
      dispatch(notify({
        message: `${blog.title} by ${blog.author} liked`,
        isGood: true,
      }))
    } catch {
      dispatch(notify({
        message: 'failed to like blog',
        isGood: false,
      }))
    }
  }
}


export default blogSlice.reducer