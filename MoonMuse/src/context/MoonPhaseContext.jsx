import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentMoonPhase } from '../utils/moonPhase'
import { MOON_THEMES } from '../utils/moonThemes'
import { PERSONAL_THEMES } from '../utils/personalThemes'

const MoonPhaseContext = createContext(null)
const THEME_STORAGE_KEY = 'moonmuse_theme'

export function MoonPhaseProvider({ children }) {
  const [phase, setPhase] = useState(() => getCurrentMoonPhase())
  const [themeKey, setThemeKey] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) || 'default'
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(getCurrentMoonPhase())
    }, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  const moonTheme = MOON_THEMES[phase.name]
  const personalTheme = PERSONAL_THEMES[themeKey]

  useEffect(() => {
    const root = document.documentElement

    if (personalTheme.fixed) {
      root.style.setProperty('--moon-bg', personalTheme.background)
      root.style.setProperty('--moon-accent', personalTheme.accent)
      root.style.setProperty('--moon-glow', personalTheme.accentSoft || personalTheme.accent)
      root.style.setProperty('--moon-surface', personalTheme.surface)
      root.style.setProperty('--moon-text', personalTheme.text)
    } else {
      root.style.setProperty('--moon-bg', moonTheme.background)
      root.style.setProperty('--moon-accent', moonTheme.accent)
      root.style.setProperty('--moon-glow', moonTheme.glow)
      root.style.setProperty('--moon-surface', 'rgba(255,255,255,0.05)')
      root.style.setProperty('--moon-text', '#c9d6ff')
    }

    root.style.setProperty('--moon-font-heading', personalTheme.fontHeading)
    root.style.setProperty('--moon-font-body', personalTheme.fontBody)
  }, [moonTheme, personalTheme])

  function selectTheme(key) {
    setThemeKey(key)
    localStorage.setItem(THEME_STORAGE_KEY, key)
  }

  return (
    <MoonPhaseContext.Provider value={{ phase, themeKey, selectTheme, personalTheme }}>
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