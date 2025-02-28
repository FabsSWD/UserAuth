import express from 'express'
import { PORT } from './config.js'

import { UserRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs') // Template Engine
app.use(express.json()) // Middleware

app.get('/', (req, res) => {
  res.render('example', { username: 'Hello World' })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserRepository.login({ username, password })
    res.send({ user })
  } catch (error) {
    res.status(401).json({ error: error.message }) // Not recommended
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log(req.body)

  try {
    const id = await UserRepository.create({ username, password })
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
