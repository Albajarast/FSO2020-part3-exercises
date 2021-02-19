const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
]

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const generateId = () => randomNumber(1, 999999999999)

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Phonebook App!</h1>')
})

app.get('/info', (req, res) => {
  const requestDate = new Date().toString()
  const contactNum = persons.length

  res.send(
    `<p><strong>Your phonebook has ${contactNum} contacts</strong></p><p>${requestDate}<p>`
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({
      error: 'No name or number has been provided'
    })
  }

  const foundPerson = persons.find((person) => person.name === name)

  if (foundPerson) {
    return res.status(400).json({
      error: 'The name must be unique'
    })
  }

  const person = {
    name: name,
    number: number,
    id: generateId(),
    date: new Date()
  }

  persons = persons.concat(person)
  res.json(person)
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
