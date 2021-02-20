const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phonebook-app:${password}@cluster0.eqvme.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date
})

const Person = mongoose.model('Person', personSchema)

const hasNameAndNumber = process.argv.length === 5

if (process.argv.length === 3) {
  getAllPersons()
} else if (!hasNameAndNumber) {
  console.log('Please provide a name and a number')
  process.exit(1)
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then((result) => {
    console.log(`${result.name} added to phonebook`)
    mongoose.connection.close()
  })
}

function getAllPersons() {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

// function saveNewPerson() {
//   const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4]
//   })

//   person.save().then((result) => {
//     console.log(`${result.name} added to phonebook`)
//     mongoose.connection.close()
//   })
// }
