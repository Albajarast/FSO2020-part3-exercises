const { response } = require('express')
const express = require('express')
const app = express()

const PORT = 3001

app.use(express.json())

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

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params

  const person = persons.find((person) => person.id === parseInt(id))

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})