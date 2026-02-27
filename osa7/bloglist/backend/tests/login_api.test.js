const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./api_test_helper')
const app = require('../app')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('login api', () => {
  test('valid user can log in', async () => {
    const body = {
      username: 'pete',
      password: 'password2',
    }
    await api
      .post('/api/login')
      .send(body)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('login api returns a valid token', async () => {
    const body = {
      username: 'pete',
      password: 'password2',
    }
    const tokenObject = await api
      .post('/api/login')
      .send(body)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(tokenObject && tokenObject.body.token)
    assert(typeof tokenObject.body.token === 'string')
    assert(tokenObject.body.token.length > 0)
    assert(jwt.verify(tokenObject.body.token, process.env.SECRET).id)
  })
  test('invalid password rejected', async () => {
    const body = {
      username: 'pete',
      password: 'password',
    }
    await api
      .post('/api/login')
      .send(body)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
  test('missing password rejected', async () => {
    const body = {
      username: 'pete',
    }
    await api
      .post('/api/login')
      .send(body)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
  test('invalid username rejected', async () => {
    const body = {
      username: 'pet',
      password: 'password',
    }
    await api
      .post('/api/login')
      .send(body)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
  test('missing username rejected', async () => {
    const body = {
      password: 'password',
    }
    await api
      .post('/api/login')
      .send(body)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  await mongoose.connection.close()
})