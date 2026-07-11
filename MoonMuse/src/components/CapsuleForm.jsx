import { useState } from 'react'
import { UNLOCK_PRESETS } from '../utils/unlockPresets'
import { format } from 'date-fns'

function CapsuleForm({ type, onSave }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [unlockDate, setUnlockDate] = useState(null)
  const [customDate, setCustomDate] = useState('')

  function handlePreset(preset) {
    setUnlockDate(preset.getDate())
    setCustomDate('')
  }

  function handleCustomDateChange(e) {
    setCustomDate(e.target.value)
    setUnlockDate(e.target.value ? new Date(e.target.value) : null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !unlockDate) return

    onSave({
      type,
      title,
      content,
      unlockDate: unlockDate.toISOString(),
    })

    setTitle('')
    setContent('')
    setUnlockDate(null)
    setCustomDate('')
  }

  const label = type === 'letter' ? 'Dear Future Me...' : 'What are you preserving?'
  const placeholder = type === 'letter'
    ? 'Write a letter to your future self...'
    : 'Goals, predictions, milestones, memories...'

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto rounded-2xl p-6 space-y-4"
      style={{ backgroundColor: 'var(--moon-surface)' }}
    >
      <input
        type="text"
        placeholder={type === 'letter' ? 'Give this letter a name...' : 'Give this capsule a name...'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
        style={{ borderColor: 'var(--moon-accent)' }}
      />

      <div>
        <label className="text-sm block mb-2 opacity-70">{label}</label>
        <textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none resize-none"
          style={{ borderColor: 'var(--moon-accent)' }}
        />
      </div>

      <div>
        <label className="text-sm block mb-2 opacity-70">When should this unlock?</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {UNLOCK_PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.label}
              onClick={() => handlePreset(preset)}
              className="px-3 py-1 rounded-full text-sm border transition"
              style={{ borderColor: 'var(--moon-accent)', opacity: 0.7 }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={customDate}
          onChange={handleCustomDateChange}
          className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
          style={{ borderColor: 'var(--moon-accent)' }}
        />
        {unlockDate && (
          <p className="text-xs mt-2 opacity-60">
            🔒 Locked until {format(unlockDate, 'MMMM d, yyyy')}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2 rounded-lg font-medium hover:opacity-90"
          style={{ backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)' }}
        >
          {type === 'letter' ? 'Seal Letter 💌' : 'Bury Capsule ⏳'}
        </button>
      </div>
    </form>
  )
}

export default CapsuleForm