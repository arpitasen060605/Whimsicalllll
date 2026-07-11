import { useState } from 'react'
import { MOODS } from '../utils/moods'

function EntryForm({ onSave, initialData = null, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [mood, setMood] = useState(initialData?.mood || '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !mood) return
    onSave({ title, content, mood })
    setTitle('')
    setContent('')
    setMood('')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white/5 rounded-2xl p-6 space-y-4">
      <div>
        <label className="text-sm text-moonlight/70 block mb-2">How are you feeling?</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              type="button"
              key={m.label}
              onClick={() => setMood(m.label)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                mood === m.label
                  ? 'bg-lavender text-midnight border-lavender'
                  : 'border-lavender/30 text-moonlight/70 hover:border-lavender'
              }`}
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
        className="w-full bg-transparent border border-lavender/30 rounded-lg px-4 py-2 text-moonlight placeholder:text-moonlight/40 focus:outline-none focus:border-lavender"
      />

      <textarea
        placeholder="What's on your mind tonight?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full bg-transparent border border-lavender/30 rounded-lg px-4 py-2 text-moonlight placeholder:text-moonlight/40 focus:outline-none focus:border-lavender resize-none"
      />

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-moonlight/60 hover:text-moonlight"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-lavender text-midnight font-medium hover:opacity-90"
        >
          {initialData ? 'Update Entry' : 'Save Entry'}
        </button>
      </div>
    </form>
  )
}

export default EntryForm