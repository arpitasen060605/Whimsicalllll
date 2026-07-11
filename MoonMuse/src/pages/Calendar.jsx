import { useState, useEffect } from 'react'
import { addMonths, subMonths, format } from 'date-fns'
import { getCalendarDays, getEntriesForDate } from '../utils/calendarGrid'
import { getEntries } from '../utils/storage'
import DayCell from '../components/DayCell'
import EntryCard from '../components/EntryCard'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    setEntries(getEntries())
  }, [])

  const days = getCalendarDays(currentDate)
  const selectedEntries = selectedDate ? getEntriesForDate(entries, selectedDate) : []

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-lavender text-center mb-8">📅 Calendar</h1>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="px-3 py-1 rounded-lg hover:bg-white/5 text-moonlight/70"
        >
          ← Prev
        </button>
        <h2 className="text-lg font-semibold text-lavender">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="px-3 py-1 rounded-lg hover:bg-white/5 text-moonlight/70"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="text-center text-xs text-moonlight/40">
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <DayCell
            key={day.date.toISOString()}
            day={day}
            entries={getEntriesForDate(entries, day.date)}
            onSelect={setSelectedDate}
          />
        ))}
      </div>

      {selectedDate && (
        <div className="mt-8">
          <h3 className="text-lavender font-semibold mb-3">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          {selectedEntries.length === 0 ? (
            <p className="text-moonlight/40 text-sm">No entries on this day.</p>
          ) : (
            <div className="space-y-4">
              {selectedEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onEdit={() => {}} onDelete={() => {}} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Calendar