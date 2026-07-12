const express = require('express')
const Capsule = require('../models/Capsule')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const capsules = await Capsule.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(capsules)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch capsules.' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { type, title, content, unlockDate } = req.body
    if (!type || !title || !content || !unlockDate) {
      return res.status(400).json({ error: 'All fields are required.' })
    }
    const newCapsule = new Capsule({ userId: req.userId, type, title, content, unlockDate })
    await newCapsule.save()
    res.status(201).json(newCapsule)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create capsule.' })
  }
})

router.put('/:id/read', async (req, res) => {
  try {
    const capsule = await Capsule.findOne({ _id: req.params.id, userId: req.userId })
    if (!capsule) return res.status(404).json({ error: 'Capsule not found.' })
    capsule.isRead = true
    await capsule.save()
    res.json(capsule)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update capsule.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const capsule = await Capsule.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!capsule) return res.status(404).json({ error: 'Capsule not found.' })
    res.json({ message: 'Capsule deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete capsule.' })
  }
})

module.exports = router