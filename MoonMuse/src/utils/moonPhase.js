// Returns a value 0-7 representing the 8 standard moon phases,
// calculated from a known new moon reference date.
const LUNAR_CYCLE_DAYS = 29.53058867

const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z')

const PHASES = [
  { name: 'New Moon', emoji: '🌑' },
  { name: 'Waxing Crescent', emoji: '🌒' },
  { name: 'First Quarter', emoji: '🌓' },
  { name: 'Waxing Gibbous', emoji: '🌔' },
  { name: 'Full Moon', emoji: '🌕' },
  { name: 'Waning Gibbous', emoji: '🌖' },
  { name: 'Last Quarter', emoji: '🌗' },
  { name: 'Waning Crescent', emoji: '🌘' },
]

export function getCurrentMoonPhase(date = new Date()) {
  const daysSinceNewMoon = (date - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24)
  const currentCycleDay = daysSinceNewMoon % LUNAR_CYCLE_DAYS
  const normalizedDay = currentCycleDay < 0 ? currentCycleDay + LUNAR_CYCLE_DAYS : currentCycleDay

  const phaseIndex = Math.floor((normalizedDay / LUNAR_CYCLE_DAYS) * 8) % 8

  return PHASES[phaseIndex]
}