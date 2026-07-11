import { useState } from 'react'
import { DREAM_EMOTIONS, DREAM_TYPES } from '../utils/dreamConstants'

function DreamForm({ onSave, initialData = null, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [emotion, setEmotion] = useState(initialData?.emotion || '')
  const [type, setType] = useState(initialData?.type || 'normal')
  const [symbolsInput, setSymbolsInput] = useState(initialData?.symbols?.join(', ') || '')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !emotion) return

    const symbols = symbolsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    onSave({ title, content, emotion, type, symbols })
    setTitle('')
    setContent('')
    setEmotion('')
    setType('normal')
    setSymbolsInput('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto rounded-2xl p-6 space-y-4"
      style={{ backgroundColor: 'var(--moon-surface)' }}
    >
      <div>
        <label className="text-sm block mb-2 opacity-70">What kind of dream was it?</label>
        <div className="flex flex-wrap gap-2">
          {DREAM_TYPES.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setType(t.key)}
              className="px-3 py-1 rounded-full text-sm border transition"
              style={
                type === t.key
                  ? { backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)', borderColor: 'var(--moon-accent)' }
                  : { borderColor: 'var(--moon-accent)', opacity: 0.6 }
              }
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm block mb-2 opacity-70">How did it feel?</label>
        <div className="flex flex-wrap gap-2">
          {DREAM_EMOTIONS.map((e) => (
            <button
              type="button"
              key={e.label}
              onClick={() => setEmotion(e.label)}
              className="px-3 py-1 rounded-full text-sm border transition"
              style={
                emotion === e.label
                  ? { backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)', borderColor: 'var(--moon-accent)' }
                  : { borderColor: 'var(--moon-accent)', opacity: 0.6 }
              }
            >
              {e.emoji} {e.label}
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        placeholder="Give this dream a title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
        style={{ borderColor: 'var(--moon-accent)' }}
      />

      <textarea
        placeholder="Describe your dream..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none resize-none"
        style={{ borderColor: 'var(--moon-accent)' }}
      />

      <input
        type="text"
        placeholder="Dream symbols, separated by commas (e.g. water, flying, teeth)"
        value={symbolsInput}
        onChange={(e) => setSymbolsInput(e.target.value)}
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
          {initialData ? 'Update Dream' : 'Save Dream'}
        </button>
      </div>
    </form>
  )
}

export default DreamForm