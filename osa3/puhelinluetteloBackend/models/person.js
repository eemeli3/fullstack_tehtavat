const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('failed to connect to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: { // number must be a valid phone number (2-3 digits followed by "-" followed by more digits)
      validator: (input) => /^(?:\d{2}|\d{3})-\d{1,}$/.test(input),
      message: 'Not a valid phone number'
    },
    required: true
  }
})

personSchema.set('toJSON', { // when information for a person is retrieved from MongoDB delete version number and convert ID-object to string
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
