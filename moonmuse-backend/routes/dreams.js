const express = require('express')
const Dream = require('../models/Dream')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const dreams = await Dream.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(dreams)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dreams.' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, content, emotion, type, symbols } = req.body
    if (!title || !content || !emotion) {
      return res.status(400).json({ error: 'Title, content, and emotion are required.' })
    }
    const newDream = new Dream({ userId: req.userId, title, content, emotion, type, symbols: symbols || [] })
    await newDream.save()
    res.status(201).json(newDream)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create dream.' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const dream = await Dream.findOne({ _id: req.params.id, userId: req.userId })
    if (!dream) return res.status(404).json({ error: 'Dream not found.' })

    const { title, content, emotion, type, symbols } = req.body
    if (title !== undefined) dream.title = title
    if (content !== undefined) dream.content = content
    if (emotion !== undefined) dream.emotion = emotion
    if (type !== undefined) dream.type = type
    if (symbols !== undefined) dream.symbols = symbols

    await dream.save()
    res.json(dream)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update dream.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const dream = await Dream.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!dream) return res.status(404).json({ error: 'Dream not found.' })
    res.json({ message: 'Dream deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete dream.' })
  }
})

module.exports = router