const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('body', (request, response) => {
    const body = request.body
    return body ? JSON.stringify(body) : " "
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number:"040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number:"39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number:"12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number:"39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(element => element.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(element => element.id !== id)

    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'Name is missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'Number is missing'
        })
    }

    if (persons.find(element => element.name === body.name)) {
        return response.status(400).json({
            error: `${body.name} is already in the phone book. Name must be unique.`
        })
    }

    const newId = Math.floor(Math.random()*100000)

    const newPerson = {
        id: String(newId),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)

    response.json(newPerson)

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
