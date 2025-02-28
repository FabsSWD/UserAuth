import express from 'express'
import { PORT } from './config.js'

import { UserRepository } from './user-repository.js'

const app = express()
app.use(express.json()) // Middleware

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/login', (req, res) => {})
app.post('/register', (req, res) => {
  const { username, password } = req.body
  console.log(req.body)

  try {
    const id = UserRepository.create({ username, password })
    res.status(201).json({ id })
  } catch (error) {
    res.status(400).json({ error: error.message }) // Not recommended
  }
})
app.post('/logout', (req, res) => {})

app.get('/protected', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
