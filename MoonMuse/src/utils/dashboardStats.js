import { isSameDay, subDays, differenceInCalendarDays } from 'date-fns'

export function getCurrentStreak(entries) {
  if (entries.length === 0) return 0

  const dates = entries.map((e) => new Date(e.createdAt))
  let streak = 0
  let cursor = new Date()

  // Allow streak to still count if today has no entry yet, as long as yesterday does
  const hasToday = dates.some((d) => isSameDay(d, cursor))
  if (!hasToday) cursor = subDays(cursor, 1)

  while (dates.some((d) => isSameDay(d, cursor))) {
    streak += 1
    cursor = subDays(cursor, 1)
  }

  return streak
}

export function getLongestStreak(entries) {
  if (entries.length === 0) return 0

  const uniqueDays = [...new Set(entries.map((e) => new Date(e.createdAt).toDateString()))]
    .map((d) => new Date(d))
    .sort((a, b) => a - b)

  let longest = 1
  let current = 1

  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = differenceInCalendarDays(uniqueDays[i], uniqueDays[i - 1])
    if (diff === 1) {
      current += 1
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }

  return uniqueDays.length === 0 ? 0 : longest
}

export function getTotalWords(entries) {
  return entries.reduce((sum, e) => sum + e.content.trim().split(/\s+/).filter(Boolean).length, 0)
}

export function getMostUsedTags(entries, limit = 5) {
  const counts = {}
  entries.forEach((e) => {
    e.tags?.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }))
}

export function getMoodDistribution(entries) {
  const counts = {}
  entries.forEach((e) => {
    counts[e.mood] = (counts[e.mood] || 0) + 1
  })
  return Object.entries(counts).map(([mood, count]) => ({ mood, count }))
}

export function getMonthlyActivity(entries, days = 14) {
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const day = subDays(new Date(), i)
    const count = entries.filter((e) => isSameDay(new Date(e.createdAt), day)).length
    result.push({
      label: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      entries: count,
    })
  }
  return result
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Good night'
}