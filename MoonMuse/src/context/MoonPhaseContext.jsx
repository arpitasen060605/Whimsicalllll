import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentMoonPhase } from '../utils/moonPhase'
import { MOON_THEMES } from '../utils/moonThemes'

const MoonPhaseContext = createContext(null)

export function MoonPhaseProvider({ children }) {
const [phase, setPhase] = useState(() => getCurrentMoonPhase())

  useEffect(() => {
    // Re-check the phase once a day in case the app stays open across midnight
    const interval = setInterval(() => {
      setPhase(getCurrentMoonPhase())
    }, 1000 * 60 * 60) // every hour
    return () => clearInterval(interval)
  }, [])

  const theme = MOON_THEMES[phase.name]

  useEffect(() => {
    // Apply theme colors as CSS variables on the root element
    document.documentElement.style.setProperty('--moon-bg', theme.background)
    document.documentElement.style.setProperty('--moon-accent', theme.accent)
    document.documentElement.style.setProperty('--moon-glow', theme.glow)
  }, [theme])

  return (
    <MoonPhaseContext.Provider value={{ phase, theme }}>
      {children}
    </MoonPhaseContext.Provider>
  )
}

export function useMoonPhase() {
  const context = useContext(MoonPhaseContext)
  if (!context) {
    throw new Error('useMoonPhase must be used within a MoonPhaseProvider')
  }
  return context
}