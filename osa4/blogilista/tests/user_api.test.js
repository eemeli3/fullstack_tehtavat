const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./api_test_helper')
const app = require('../app')

const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('user api', () => {
  test('users are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all users are returned', async () => {
    const response = await api.get('/api/users')
    
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
  test('user list is not empty', async () => {
    const response = await api.get('/api/users')

    assert(response.body.length > 0)
  })
  test('users include field "id"', async () => {
    const response = await api.get('/api/users')

    assert(Object.getOwnPropertyNames(response.body[0]).includes('id'))
  })
  test('a valid user can be added', async () => {
    const newUser = {
      username: 'bestUsername',
      name: "Matti Meikäläinen",
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
    assert(helper.includesUser(usersAtEnd, newUser))
  })
  test('POST request for user without username is answered with status 400', async () => {
    const newUser = {
      name: 'Peter Thor',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  test('POST request with too short username is answered with status 400', async () => {
    const newUser = {
      name: 'Peter Thor',
      username: 'p',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  test('POST request with duplicate username is answered with status 400', async () => {
    const newUser = {
      name: 'Peter Thor',
      username: 'pete',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  test('POST request for user without password is answered with status 400', async () => {
    const newUser = {
      username: "onionsoup",
      name: "Jane Onion"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  test('POST request for user with too short password is answered with status 400', async () => {
    const newUser = {
      username: "onionsoup",
      name: "Jane Onion",
      password: 'a'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})