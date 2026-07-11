import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEntries } from '../utils/storage'
import { MOODS } from '../utils/moods'
import { format } from 'date-fns'

function ReadingMode() {
  const { entryId } = useParams()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [direction, setDirection] = useState('forward')

  useEffect(() => {
    setEntries(getEntries())
  }, [])

  const currentIndex = entries.findIndex((e) => e.id === entryId)
  const entry = entries[currentIndex]

  if (entries.length === 0) {
    return (
      <div className="text-center mt-20 text-moonlight/50">
        No entries to read yet.
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="text-center mt-20 text-moonlight/50">
        Entry not found.
        <button
          onClick={() => navigate('/journal')}
          className="block mx-auto mt-4 text-lavender hover:underline"
        >
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
      <button
        onClick={() => navigate('/journal')}
        className="text-sm text-moonlight/50 hover:text-lavender mb-10"
      >
        ← Exit Reading Mode
      </button>

      <div key={entry.id} className={`font-serif ${direction === 'forward' ? 'page-forward' : 'page-backward'}`}>
        <p className="text-sm text-moonlight/50 mb-1">
          {format(new Date(entry.createdAt), 'MMMM d, yyyy')}
        </p>
        <p className="text-sm text-moonlight/50 mb-8">
          {moodData ? `${moodData.emoji} Feeling ${moodData.label}` : ''}
        </p>

        <h1 className="text-4xl font-bold text-lavender mb-8 leading-tight">
          {entry.title}
        </h1>

        <p className="text-lg leading-loose text-moonlight/90 whitespace-pre-wrap">
          {entry.content}
        </p>

        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10">
            {entry.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-lavender/10 text-lavender/70">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-16 pt-6 border-t border-lavender/10">
        <button
          disabled={!hasPrev}
          onClick={() => goTo(currentIndex + 1, 'backward')}
          className="text-sm text-moonlight/60 hover:text-lavender disabled:opacity-20 disabled:cursor-not-allowed"
        >
          ← Older Entry
        </button>
        <span className="text-xs text-moonlight/30">
          {currentIndex + 1} of {entries.length}
        </span>
        <button
          disabled={!hasNext}
          onClick={() => goTo(currentIndex - 1, 'forward')}
          className="text-sm text-moonlight/60 hover:text-lavender disabled:opacity-20 disabled:cursor-not-allowed"
        >
          Newer Entry →
        </button>
      </div>
    </div>
  )
}

export default ReadingMode