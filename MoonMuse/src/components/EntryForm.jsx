import { useState } from 'react'
import { MOODS } from '../utils/moods'
import { uploadFile } from '../utils/uploadApi'

function EntryForm({ onSave, initialData = null, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [mood, setMood] = useState(initialData?.mood || '')
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '')
  const [media, setMedia] = useState(initialData?.media || [])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleFileChange(e) {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    setUploadError('')

    try {
      for (const file of files) {
        if (file.size > 20 * 1024 * 1024) {
          setUploadError(`"${file.name}" is too large (max 20MB).`)
          continue
        }
        const result = await uploadFile(file)
        setMedia((prev) => [...prev, result])
      }
    } catch (err) {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = '' // allow re-selecting the same file
    }
  }

  function removeMedia(index) {
    setMedia((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !mood) return

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)

    onSave({ title, content, mood, tags, media })
    setTitle('')
    setContent('')
    setMood('')
    setTagsInput('')
    setMedia([])
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto rounded-2xl p-6 space-y-4"
      style={{ backgroundColor: 'var(--moon-surface)' }}
    >
      <div>
        <label className="text-sm text-moonlight/70 block mb-2 opacity-70">How are you feeling?</label>
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

      <div>
        <label className="text-sm block mb-2 opacity-70">📷 Attach photos or videos</label>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="text-sm opacity-80"
        />
        {uploading && <p className="text-xs mt-2 opacity-60">Uploading...</p>}
        {uploadError && <p className="text-xs mt-2 text-red-400">{uploadError}</p>}

        {media.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {media.map((item, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--moon-accent)' }}>
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.url} alt="attachment" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg opacity-60 hover:opacity-100">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={uploading}
          className="px-5 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)' }}
        >
          {initialData ? 'Update Entry' : 'Save Entry'}
        </button>
      </div>
    </form>
  )
}

export default EntryForm