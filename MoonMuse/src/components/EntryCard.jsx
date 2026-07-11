import { MOODS } from '../utils/moods'

function EntryCard({ entry, onEdit, onDelete }) {
  const moodData = MOODS.find((m) => m.label === entry.mood)
  const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="bg-white/5 rounded-xl p-5 border border-lavender/10">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lavender">{entry.title}</h3>
        <span className="text-xs text-moonlight/50">{date}</span>
      </div>
      <p className="text-sm text-moonlight/50 mb-2">
        {moodData ? `${moodData.emoji} ${moodData.label}` : entry.mood}
      </p>
      <p className="text-moonlight/80 whitespace-pre-wrap">{entry.content}</p>

      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-lavender/10 text-lavender/80"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-4 text-sm">
        <button onClick={() => onEdit(entry)} className="text-moonlight/60 hover:text-lavender">
          Edit
        </button>
        <button onClick={() => onDelete(entry.id)} className="text-moonlight/60 hover:text-red-400">
          Delete
        </button>
      </div>
    </div>
  )
}

export default EntryCard