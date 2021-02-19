require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const PORT = process.env.PORT

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

app.post('/api/persons', (req, res) => {
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

  // Person.find({ name: name }).then((foundPerson) => {
  //   if (foundPerson.length !== 0) {
  //     res.status(400).json({
  //       error: 'The name must be unique'
  //     })
  //   } else {
  //     newPerson.save().then((person) => {
  //       res.json(person)
  //     })
  //   }
  // })
  newPerson.save().then((person) => {
    res.json(person)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params

  const person = persons.find((person) => person.id === parseInt(id))

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params
  const deletedId = parseInt(id)

  persons = persons.filter((person) => person.id !== deletedId)

  res.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
