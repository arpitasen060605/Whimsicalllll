import { DREAM_EMOTIONS, DREAM_TYPES } from '../utils/dreamConstants'

function DreamCard({ dream, onEdit, onDelete }) {
  const emotionData = DREAM_EMOTIONS.find((e) => e.label === dream.emotion)
  const typeData = DREAM_TYPES.find((t) => t.key === dream.type)
  const date = new Date(dream.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: 'var(--moon-surface)', borderColor: 'var(--moon-accent)', borderOpacity: 0.1 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold" style={{ color: 'var(--moon-accent)' }}>{dream.title}</h3>
        <span className="text-xs opacity-50">{date}</span>
      </div>
      <p className="text-sm opacity-60 mb-2">
        {typeData?.emoji} {typeData?.label} · {emotionData?.emoji} {dream.emotion}
      </p>
      <p className="opacity-90 whitespace-pre-wrap break-words">{dream.content}</p>

      {dream.symbols?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {dream.symbols.map((symbol) => (
            <span
              key={symbol}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--moon-glow)', color: 'var(--moon-accent)', opacity: 0.8 }}
            >
              🔮 {symbol}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-4 text-sm">
        <button onClick={() => onEdit(dream)} className="opacity-60 hover:opacity-100">
          Edit
        </button>
        <button onClick={() => onDelete(dream.id)} className="opacity-60 hover:text-red-400">
          Delete
        </button>
      </div>
    </div>
  )
}

export default DreamCard