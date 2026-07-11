import { getCurrentMoonPhase } from '../utils/moonPhase'
import { MOODS } from '../utils/moods'

function DayCell({ day, entries, onSelect }) {
  const moonPhase = getCurrentMoonPhase(day.date)
  const hasEntries = entries.length > 0
  const firstMood = entries[0] ? MOODS.find((m) => m.label === entries[0].mood) : null

  return (
    <button
      onClick={() => onSelect(day.date)}
      className={`aspect-square rounded-lg border p-2 flex flex-col items-center justify-between transition
        ${day.isCurrentMonth ? 'border-lavender/10' : 'border-transparent opacity-30'}
        ${day.isToday ? 'border-lavender ring-1 ring-lavender' : ''}
        ${hasEntries ? 'bg-white/5 hover:bg-white/10' : 'hover:bg-white/5'}
      `}
    >
      <span className="text-xs text-moonlight/60">{day.dayNumber}</span>
      <span className="text-lg">{firstMood?.emoji || ''}</span>
      <span className="text-[10px] opacity-50">{moonPhase.emoji}</span>
    </button>
  )
}

export default DayCell