const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [// initial blogs for testing
  {
    _id: "69496219d0c58549a4d9c450",
    title: "New blog",
    author: "YYYAAAAAH",
    url: "http://someurl1009.com/",
    likes: 7,
    user: '694141ed20a10336de0ddb76',
    __v: 0
  },
  {
    _id: "694962c3d0c58549a4d9c454",
    title: "How to peel onions",
    author: "Petteri",
    url: "https://bestUrl.com/prettyUrl",
    likes: 5,
    user: '694141ed20a10336de0ddb76',
    __v: 0
  },
  {
    _id: "6949631ad0c58549a4d9c458",
    title: "Comics here",
    author: "Wisest",
    url: "http://blogarchive.com/comicshere",
    likes: 12,
    user: '694140fc20a10336de0ddb74',
    __v: 0
  },
  {
    _id: "6949680f23be7912c7bdf78a",
    title: "Great New Blog",
    author: "ExpiredToken",
    url: "http://javascript.com/tokenpractice",
    likes: 12,
    user: '694141ed20a10336de0ddb76',
    __v: 0
  }, 
]

const initialUsers = [// initial users for testing
  {
    username: 'merja',
    name: 'Merja Maija',
    _id: '694140fc20a10336de0ddb74',
    passwordHash: '$2b$10$Et4pXXFIIY6O30sh0GhI/egk.rwXX2SBDSQIiG0oKxPeYTgR008Z.',
    blogs: [
      '6949631ad0c58549a4d9c458',
    ],
    __v: 0
  },
  {
    username: 'pete',
    name: 'Petteri Keka',
    _id: '694141ed20a10336de0ddb76',
    passwordHash: '$2b$10$H3XiN/els.PmSGvXclQiAeD.8nwbvKvD9/SgFdxUQpQ0FicULQxoy',
    blogs: [
      '69496219d0c58549a4d9c450',
      '694962c3d0c58549a4d9c454',
      '6949680f23be7912c7bdf78a',
      '69497cbd543898a621ed7b8f',
    ],
    __v: 0
  }
]

const includesBlog = (blogs, refBlog) => {// function for checking if refblog is in blogs
  for (const blog of blogs) {
    if ( blog.title === refBlog.title && blog.author === refBlog.author && blog.url === refBlog.url && blog.likes === refBlog.likes ) {
      return true
    }
  }
  return false
}

const includesUser = (users, refUser) => {// function for checking if refUser is in users
  for (const user of users) {
    if ( user.username === refUser.username && user.name === refUser.name ) {
      return true
    }
  }
  return false
}

const blogsInDb = async () => {// function for getting all blogs in database
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const getBlog = async ( id ) => {// function for getting a specific blog in database
  const blog = await Blog.findById(id)
  return blog.toJSON()
}

const usersInDb = async () => {// function for getting all users in database
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { 
  initialBlogs,
  blogsInDb,
  includesBlog,
  getBlog,
  initialUsers,
  usersInDb,
  includesUser
}