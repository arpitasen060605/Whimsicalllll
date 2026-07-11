import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
} from 'date-fns'

export function getCalendarDays(currentDate) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const gridStart = startOfWeek(monthStart)
  const gridEnd = endOfWeek(monthEnd)

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    dayNumber: format(date, 'd'),
    isCurrentMonth: isSameMonth(date, currentDate),
    isToday: isSameDay(date, new Date()),
  }))
}

export function getEntriesForDate(entries, date) {
  return entries.filter((entry) => isSameDay(new Date(entry.createdAt), date))
}