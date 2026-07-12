const mongoose = require('mongoose')

const dreamSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  emotion: { type: String, required: true },
  type: { type: String, required: true },
  symbols: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Dream', dreamSchema)