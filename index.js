require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')

const PORT = process.env.PORT

// Own middlewares
const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Wrong id format' })
  }

  if (err.name === 'ValidationError' && err.errors.name.kind === 'unique') {
    return res.status(400).json({
      message: 'The person already exists in the DB',
      error: err.message
    })
  }

  next(err)
}

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = []

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const generateId = () => randomNumber(1, 999999999999)

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Phonebook App!</h1>')
})

app.get('/info', (req, res) => {
  const requestDate = new Date().toString()
  Person.find({}).then((persons) => {
    res.send(
      `<p><strong>Your phonebook has ${persons.length} contacts</strong></p><p>${requestDate}<p>`
    )
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const newPerson = new Person({
    name: name,
    number: number,
    id: generateId(),
    date: new Date()
  })

  if (!name || !number) {
    return res.status(400).json({
      error: 'No name or number has been provided'
    })
  }

  newPerson
    .save()
    .then((person) => {
      res.json(person)
    })
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (req, res) => {
  console.log(`You tried to update the id: ${req.params.id}`)
  const { id } = req.params
  console.log(req.body)
  const { name, number } = req.body

  const person = {
    name: name,
    number: number
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((result) => {
      res.json(result)
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.findById(id)
    .then((person) => {
      res.json(person)
    })
    .catch((err) => {
      next(err)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
