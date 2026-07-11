import { format } from 'date-fns'
import { isUnlocked } from '../utils/capsuleStorage'

function CapsuleCard({ capsule, onOpen, onDelete }) {
  const unlocked = isUnlocked(capsule)

  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: 'var(--moon-surface)', borderColor: 'var(--moon-accent)', borderOpacity: 0.1 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold" style={{ color: 'var(--moon-accent)' }}>
          {unlocked ? capsule.title : '🔒 ' + capsule.title}
        </h3>
        <span className="text-xs opacity-50">
          {unlocked ? 'Unlocked' : format(new Date(capsule.unlockDate), 'MMM d, yyyy')}
        </span>
      </div>

      {unlocked ? (
        <>
          <p className="opacity-90 whitespace-pre-wrap mb-3">{capsule.content}</p>
          <p className="text-xs opacity-40 mb-3">
            Written on {format(new Date(capsule.createdAt), 'MMMM d, yyyy')}
          </p>
        </>
      ) : (
        <p className="text-sm opacity-50 italic mb-3">
          This {capsule.type === 'letter' ? 'letter' : 'capsule'} is still sealed. Come back on{' '}
          {format(new Date(capsule.unlockDate), 'MMMM d, yyyy')}.
        </p>
      )}

      <div className="flex gap-4 text-sm">
        {unlocked && !capsule.isRead && (
          <button onClick={() => onOpen(capsule.id)} className="opacity-60 hover:opacity-100">
            Mark as Read
          </button>
        )}
        <button onClick={() => onDelete(capsule.id)} className="opacity-60 hover:text-red-400">
          Delete
        </button>
      </div>
    </div>
  )
}

export default CapsuleCard