require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})


app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    const time = new Date()
    res.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${time}</p>
      `)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }
      person.name = name
      person.number = number

      return person.save().then((returnedPerson) => {
        res.json(returnedPerson)
      })
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
