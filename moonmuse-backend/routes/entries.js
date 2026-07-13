const express = require('express')
const Entry = require('../models/Entry')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// All entry routes require a logged-in user
router.use(authMiddleware)

// GET /api/entries - get all entries for the logged-in user
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(entries)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch entries.' })
  }
})

// POST /api/entries - create a new entry
 router.post('/', async (req, res) => {
  try {
    const { title, content, mood, tags, media } = req.body

    if (!title || !content || !mood) {
      return res.status(400).json({ error: 'Title, content, and mood are required.' })
    }

    const newEntry = new Entry({
      userId: req.userId,
      title,
      content,
      mood,
      tags: tags || [],
      media: media || [],
    })

    await newEntry.save()
    res.status(201).json(newEntry)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create entry.' })
  }
})

// PUT /api/entries/:id - update an existing entry
router.put('/:id', async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, userId: req.userId })

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found.' })
    }

   const { title, content, mood, tags, media } = req.body
    if (title !== undefined) entry.title = title
    if (content !== undefined) entry.content = content
    if (mood !== undefined) entry.mood = mood
    if (tags !== undefined) entry.tags = tags
    if (media !== undefined) entry.media = media
    await entry.save()
    res.json(entry)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update entry.' })
  }
})

// DELETE /api/entries/:id - delete an entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.userId })

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found.' })
    }

    res.json({ message: 'Entry deleted successfully.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete entry.' })
  }
})

module.exports = router