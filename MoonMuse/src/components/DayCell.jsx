import { getCurrentMoonPhase } from '../utils/moonPhase'
import { MOODS } from '../utils/moods'

function DayCell({ day, entries, onSelect }) {
  const moonPhase = getCurrentMoonPhase(day.date)
  const hasEntries = entries.length > 0
  const firstMood = entries[0] ? MOODS.find((m) => m.label === entries[0].mood) : null

  return (
    <button
      onClick={() => onSelect(day.date)}
      className={`aspect-square rounded-lg border p-2 flex flex-col items-center justify-between transition ${
        day.isCurrentMonth ? '' : 'opacity-30'
      }`}
      style={{
        borderColor: day.isToday ? 'var(--moon-accent)' : 'rgba(128,128,128,0.2)',
        borderWidth: day.isToday ? '2px' : '1px',
        backgroundColor: hasEntries ? 'var(--moon-surface)' : 'transparent',
      }}
    >
      <span className="text-xs opacity-70">{day.dayNumber}</span>
      <span className="text-lg">{firstMood?.emoji || ''}</span>
      <span className="text-[10px] opacity-50">{moonPhase.emoji}</span>
    </button>
  )
}

export default DayCell