import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchEntries } from '../utils/entriesApi'
import { MOODS } from '../utils/moods'
import { format } from 'date-fns'

function ReadingMode() {
  const { entryId } = useParams()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [direction, setDirection] = useState('forward')

  useEffect(() => {
    fetchEntries()
      .then((data) => setEntries(data.map((e) => ({ ...e, id: e._id }))))
      .catch(() => setEntries([]))
  }, [])

  const currentIndex = entries.findIndex((e) => e.id === entryId)
  const entry = entries[currentIndex]

  if (entries.length === 0) {
    return <div className="text-center mt-20 opacity-50">No entries to read yet.</div>
  }

  if (!entry) {
    return (
      <div className="text-center mt-20 opacity-50">
        Entry not found.
        <button onClick={() => navigate('/journal')} className="block mx-auto mt-4 hover:underline" style={{ color: 'var(--moon-accent)' }}>
          Back to Journal
        </button>
      </div>
    )
  }

  const moodData = MOODS.find((m) => m.label === entry.mood)
  const hasPrev = currentIndex < entries.length - 1
  const hasNext = currentIndex > 0

  function goTo(index, dir) {
    setDirection(dir)
    navigate(`/read/${entries[index].id}`)
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <button onClick={() => navigate('/journal')} className="text-sm opacity-60 hover:opacity-100 mb-10">
        ← Exit Reading Mode
      </button>

      <div key={entry.id} className={`font-serif ${direction === 'forward' ? 'page-forward' : 'page-backward'}`}>
        <p className="text-sm opacity-50 mb-1">{format(new Date(entry.createdAt), 'MMMM d, yyyy')}</p>
        <p className="text-sm opacity-50 mb-8">
          {moodData ? `${moodData.emoji} Feeling ${moodData.label}` : ''}
        </p>

        <h1 className="text-4xl font-bold mb-8 leading-tight" style={{ color: 'var(--moon-accent)' }}>
          {entry.title}
        </h1>

       <p className="text-lg leading-loose opacity-90 whitespace-pre-wrap break-words">{entry.content}</p>

        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10">
            {entry.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--moon-glow)', opacity: 0.7 }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-16 pt-6 border-t" style={{ borderColor: 'rgba(128,128,128,0.2)' }}>
        <button disabled={!hasPrev} onClick={() => goTo(currentIndex + 1, 'backward')} className="text-sm opacity-60 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed">
          ← Older Entry
        </button>
        <span className="text-xs opacity-30">{currentIndex + 1} of {entries.length}</span>
        <button disabled={!hasNext} onClick={() => goTo(currentIndex - 1, 'forward')} className="text-sm opacity-60 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed">
          Newer Entry →
        </button>
      </div>
    </div>
  )
}

export default ReadingMode