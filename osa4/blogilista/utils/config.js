require('dotenv').config()

const PORT = process.env.PORT
const mongoUrl = process.env.NODE_ENV === 'test'// URL for database. Testing uses a separate database
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = { mongoUrl, PORT }