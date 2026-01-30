const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [// initial blogs for testing
  {
    _id: "695c3a0f1bf14c3ccbfc6cb7",
    title: "Hello world",
    author: "eager Token",
    url: "http://javascript/tokentest",
    likes: 10001,
    user: '694141ed20a10336de0ddb76',
    __v: 0
  },
  {
    _id: "695c3b2a1bf14c3ccbfc6cbb",
    title: "The journey to the moon",
    author: "Austronaut",
    url: "http://spacetalks/4ad3453453sds435",
    likes: 0,
    user: '694141ed20a10336de0ddb76',
    __v: 0
  },
  {
    _id: "695c3b6d1bf14c3ccbfc6cbf",
    title: "Tokens, tokens, tokens",
    author: "Pete",
    url: "http://forums/tokenstokenstokens",
    likes: 0,
    user: '694141ed20a10336de0ddb76',
    __v: 0
  },
  {
    _id: "695c3bd61bf14c3ccbfc6cc4",
    title: "The greatest blog",
    author: "UnkownAuthor",
    url: "http://blogspace/thegreatestblog",
    likes: 89,
    user: '695c39a31bf14c3ccbfc6cb4',
    __v: 0
  },
  {
    _id: "695c3d951bf14c3ccbfc6ccb",
    title: "New blogspaces",
    author: "fred",
    url: "http://forum/dicussions/a324da324234",
    likes: 1,
    user: '695c3d241bf14c3ccbfc6cc7',
    __v: 0
  },
  {
    _id: "695c3db51bf14c3ccbfc6ccf",
    title: "Javascript and node",
    author: "fred",
    url: "http://forum/dicussions/a324da345345",
    likes: 1,
    user: '695c3d241bf14c3ccbfc6cc7',
    __v: 0
  },
]

const initialUsers = [// initial users for testing
  {
    username: 'pete',
    name: 'Petteri Keka',
    _id: '694141ed20a10336de0ddb76',
    passwordHash: '$2b$10$H3XiN/els.PmSGvXclQiAeD.8nwbvKvD9/SgFdxUQpQ0FicULQxoy',
    blogs: [
      '695c3a0f1bf14c3ccbfc6cb7',
      '695c3b2a1bf14c3ccbfc6cbb',
      '695c3b6d1bf14c3ccbfc6cbf',
    ],
    __v: 0
  },
  {
    username: 'maija',
    name: 'maija tee',
    _id: '695c39a31bf14c3ccbfc6cb4',
    passwordHash: '$2b$10$PRXihm8bISE61MFs/rC.zuNxkcardM6cUgtPDXttQpKHc25dJR1M.',
    blogs: [
      '695c3bd61bf14c3ccbfc6cc4',
    ],
    __v: 0
  },
  {
    username: 'fred',
    name: 'Fred Friend',
    _id: '695c3d241bf14c3ccbfc6cc7',
    passwordHash: '$2b$10$Hfad7n0vpdYNykRgfLXdcuOXEtvZFM6t3DfXJTIaGPA8Ct80z5Mxi',
    blogs: [
      '695c3d951bf14c3ccbfc6ccb',
      '695c3db51bf14c3ccbfc6ccf'
    ],
    __v: 0
  },
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