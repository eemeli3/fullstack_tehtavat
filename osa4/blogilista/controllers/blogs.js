const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {// get all blogs
  const blogs = await Blog
    .find({})
    .populate('user', { username: 2, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {// post new blog
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: !request.body.likes ? 0 : request.body.likes,
    user: request.user._id
  })

  if (blog.title && blog.url) {// blog has title and url
    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(savedBlog)
  }
  else {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {// delete blog
  try {// blog passes authorization
    const blog = await Blog.findById(request.params.id)
    if (!blog.title) {// blog does not exist
      response.status(204).end()
    }
    if (blog.user.toString() !== request.user._id.toString()) {// user is not allowed to delete blog
      return response.status(401).json({ error: 'unauthorized user' })
    }
    await Blog.findByIdAndDelete(request.params.id) // delete blog
    request.user.blogs = request.user.blogs.filter( blogId => blogId.toString() !== request.params.id )
    await request.user.save() // remove blog id from user profile
    response.status(204).end()
  } catch {
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {// change blog
  const { title, author, url, likes } = request.body
  
  const getBlog = async (id) => {
    try {
      const blog = await Blog.findById(id)
      return blog
    } catch {
      response.status(404).end()
    }
  }

  const blog = await getBlog(request.params.id)
  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const returnedBlog = await blog.save()
  response.json(returnedBlog)
})

module.exports = blogsRouter