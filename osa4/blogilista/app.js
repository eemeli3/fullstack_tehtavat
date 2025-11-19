const express = require('express')
const mongoose = require('mongoose')
const { info, error } = require('./utils/logger')
const { mongoUrl, PORT } = require('./utils/config')
const blogsRouter = require('./controllers/blogs')

const app = express()

mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app