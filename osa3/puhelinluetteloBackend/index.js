require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', request => {
  const body = request.body
  return body ? JSON.stringify(body) : ' '
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {// get all information for all people in phonebook
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {// get html that displays amount of people in phonebook and current date
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {// get information for a person
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {// delete a person from phonebook
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {// add a person to phonebook
  const body = request.body

  // if (!body.name) {// name is missing
  //   return response.status(400).json({
  //     error: 'Name is missing'
  //   })
  // }

  // if (!body.number) {// phonenumber is missing
  //   return response.status(400).json({
  //     error: 'Number is missing'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save() // save person to phonebook
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {// change phonenumber for a person in phonebook
  const number = request.body.number

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.number = number

      return person.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {// handle unknown route
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
