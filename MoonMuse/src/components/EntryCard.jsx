import { Link } from 'react-router-dom'
import { MOODS } from '../utils/moods'

function EntryCard({ entry, onEdit, onDelete }) {
  const moodData = MOODS.find((m) => m.label === entry.mood)
  const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--moon-surface)', borderColor: 'var(--moon-accent)', borderOpacity: 0.1 }}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold" style={{ color: 'var(--moon-accent)' }}>{entry.title}</h3>
        <span className="text-xs opacity-50">{date}</span>
      </div>
      <p className="text-sm opacity-60 mb-2">
        {moodData ? `${moodData.emoji} ${moodData.label}` : entry.mood}
      </p>
      <p className="opacity-90 whitespace-pre-wrap break-words">{entry.content}</p>
       {entry.media?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {entry.media.map((item, i) => (
            <div key={i} className="w-24 h-24 rounded-lg overflow-hidden">
              {item.type === 'video' ? (
                <video src={item.url} controls className="w-full h-full object-cover" />
              ) : (
                <img src={item.url} alt="memory" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      )}
      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--moon-glow)', color: 'var(--moon-accent)', opacity: 0.8 }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-4 text-sm">
        <Link to={`/read/${entry.id}`} className="opacity-60 hover:opacity-100">
          Read
        </Link>
        <button onClick={() => onEdit(entry)} className="opacity-60 hover:opacity-100">
          Edit
        </button>
        <button onClick={() => onDelete(entry.id)} className="opacity-60 hover:text-red-400">
          Delete
        </button>
      </div>
    </div>
  )
}

export default EntryCard
