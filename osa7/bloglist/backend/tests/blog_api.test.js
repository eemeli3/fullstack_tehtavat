const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./api_test_helper')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('blog api', () => {
  describe('GET request tests', () => {
    test('blogs are returned as JSON', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    test('blog list is not empty', async () => {
      const response = await api.get('/api/blogs')

      assert(response.body.length > 0)
    })
    test('blogs include field "id"', async () => {
      const response = await api.get('/api/blogs')

      assert(Object.getOwnPropertyNames(response.body[0]).includes('id'))
    })
  })
  describe('POST request tests', () => {
    test('a valid blog can be added', async () => {
      const tokenObject = await api
        .post('/api/login')
        .send({
          username: 'pete',
          password: 'password2',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const newBlog = {
        title: "New Blog",
        author: "Matti Meikäläinen",
        url: "https://exampleURL/exampleurl",
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '+tokenObject.body.token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      assert(helper.includesBlog(blogsAtEnd, newBlog))
    })
    test('if a blog without likes is added it has 0 likes', async () => {
      const tokenObject = await api
        .post('/api/login')
        .send({
          username: 'pete',
          password: 'password2',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      
      const newBlog = {
        title: "A very important blog",
        author: "A very good author",
        url: "https://averyimportanturl/anevenmoreimportanturl"
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '+tokenObject.body.token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert(helper.includesBlog(blogsAtEnd, {...newBlog, likes: 0}))
    })
    test('POST request for blog without title is answered with status 400', async () => {
      const tokenObject = await api
        .post('/api/login')
        .send({
          username: 'pete',
          password: 'password2',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)    
      
      const newBlog = {
        author: "Peter Thor",
        url: "https://awaitasync",
        likes: 9
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '+tokenObject.body.token)
        .send(newBlog)
        .expect(400)
    })
    test('POST request for blog without url is answered with status 400', async () => {
      const tokenObject = await api
        .post('/api/login')
        .send({
          username: 'pete',
          password: 'password2',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)    
      
      const newBlog = {
        title: "How to peel an onion",
        author: "Jane Onion",
        likes: 3
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '+tokenObject.body.token)
        .send(newBlog)
        .expect(400)
    })
    test('POST request without "Authorization" header is answered with status 401', async () => {
      const tokenObject = await api
        .post('/api/login')
        .send({
          username: 'pete',
          password: 'password2',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)    
      
      const newBlog = {
        title: "How to peel an onion",
        author: "Jane Onion",
        url: "https://awaitasync",
        likes: 3
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
    test('POST request with invalid token is answered with status 401', async () => {
      const tokenObject = await api
        .post('/api/login')
        .send({
          username: 'pete',
          password: 'password2',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)    
      
      const newBlog = {
        title: "How to peel an onion",
        author: "Jane Onion",
        url: "https://awaitasync",
        likes: 3
      }

      const token = '1' !== tokenObject.body.token ? '1' : '0'

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '+token)
        .send(newBlog)
        .expect(401)
    })
  })
  describe('DELETE request tests', () => {
    test('DELETE request deletes a blog', async () => {
      const loginInfo = {
        username: 'pete',
        password: 'password2',
      }
      const tokenObject = await api
        .post('/api/login')
        .send(loginInfo)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtStart = await helper.blogsInDb()
      const user = await User.findOne({ username: loginInfo.username })
      const blogToDelete = await Blog.findOne({ user: user._id })
      await api
        .delete(`/api/blogs/${blogToDelete._id.toString()}`)
        .set('Authorization', 'Bearer '+tokenObject.body.token)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length + 1, blogsAtStart.length)
    })
    test('DELETE request deletes the correct blog', async () => {
      const loginInfo = {
        username: 'pete',
        password: 'password2',
      }
      const tokenObject = await api
        .post('/api/login')
        .send(loginInfo)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const user = await User.findOne({ username: loginInfo.username })
      const blogToDelete = await Blog.findOne({ user: user._id })
      
      await api
        .delete(`/api/blogs/${blogToDelete._id.toString()}`)
        .set('Authorization', 'Bearer '+tokenObject.body.token)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert(!blogsAtEnd.map(item => item.id).includes(blogToDelete._id.toString()))
    })
    test('DELETE request with invalid ID does nothing', async () => {
      const loginInfo = {
        username: 'pete',
        password: 'password2',
      }
      const tokenObject = await api
        .post('/api/login')
        .send(loginInfo)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtStart = await helper.blogsInDb()
      await api
        .delete(`/api/blogs/1`)
        .set('Authorization', 'Bearer '+tokenObject.body.token)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })
  describe('PUT request tests', () => {
    test('PUT request does not add or remove blogs', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        ...blogToUpdate,
        title: 'Updated Blog',
        author: 'Pete',
        url: 'https://updatedblogurl',
        likes: 100
      }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
    test('PUT request updates blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        ...blogToUpdate,
        title: 'Updated Blog',
        author: 'Pete',
        url: 'https://updatedblogurl',
        likes: 100
      }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogAtEnd = await helper.getBlog(blogToUpdate.id)
      assert.deepStrictEqual(blogAtEnd, updatedBlog)
    })
    test('PUT request with invalid ID returs status code 404', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        ...blogToUpdate,
        title: 'Updated Blog',
        author: 'Pete',
        url: 'https://updatedblogurl',
        likes: 100
      }
      
      await api
        .put(`/api/blogs/1`)
        .send(updatedBlog)
        .expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})