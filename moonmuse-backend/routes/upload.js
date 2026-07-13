const express = require('express')
const multer = require('multer')
const { storage } = require('../config/cloudinary')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
const upload = multer({ storage })

router.use(authMiddleware)

// POST /api/upload - upload a single image or video, returns its Cloudinary URL
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' })
  }

  res.json({
    url: req.file.path,
    type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
  })
})

module.exports = router