const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already in use.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong during signup.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong during login.' })
  }
})

// GET /api/auth/me - test protected route
router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select('-password')
  res.json({ user })
})

module.exports = router