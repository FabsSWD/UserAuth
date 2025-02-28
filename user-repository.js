import DBLocal from 'db-local'
import crypto from 'crypto'

import bcrypt from 'bcrypt'

import { SALT } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    validation.username(username)
    validation.password(password)

    const user = User.findOne({ username })
    if (user) throw new Error('Username already exists')

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT)

    User.create({ _id: id, username, password: hashedPassword }).save()

    return id
  }

  static async login ({ username, password }) {
    validation.username(username)
    validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('User not found')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('Invalid password')

    const { password: _, ...publicUser } = user

    return publicUser
  }
}

// User & Pass Validation (Optional: Use zod)
class validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 3 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long')
  }
}
