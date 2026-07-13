const mongoose = require('mongoose')

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String, required: true },
  tags: { type: [String], default: [] },
  media: [
    {
      url: String,
      type: { type: String, enum: ['image', 'video'] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Entry', entrySchema)