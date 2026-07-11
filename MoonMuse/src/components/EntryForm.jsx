import { useState } from 'react'
import { MOODS } from '../utils/moods'

function EntryForm({ onSave, initialData = null, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [mood, setMood] = useState(initialData?.mood || '')
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !mood) return

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)

    onSave({ title, content, mood, tags })
    setTitle('')
    setContent('')
    setMood('')
    setTagsInput('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto rounded-2xl p-6 space-y-4"
      style={{ backgroundColor: 'var(--moon-surface)' }}
    >
      <div>
        <label className="text-sm block mb-2 opacity-70">How are you feeling?</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              type="button"
              key={m.label}
              onClick={() => setMood(m.label)}
              className="px-3 py-1 rounded-full text-sm border transition"
              style={
                mood === m.label
                  ? { backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)', borderColor: 'var(--moon-accent)' }
                  : { borderColor: 'var(--moon-accent)', opacity: 0.6 }
              }
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        placeholder="Give your entry a title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
        style={{ borderColor: 'var(--moon-accent)' }}
      />

      <textarea
        placeholder="What's on your mind tonight?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none resize-none"
        style={{ borderColor: 'var(--moon-accent)' }}
      />

      <input
        type="text"
        placeholder="Tags, separated by commas (e.g. college, gratitude)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
        style={{ borderColor: 'var(--moon-accent)' }}
      />

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg opacity-60 hover:opacity-100">
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 rounded-lg font-medium hover:opacity-90"
          style={{ backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)' }}
        >
          {initialData ? 'Update Entry' : 'Save Entry'}
        </button>
      </div>
    </form>
  )
}

export default EntryForm