import { PERSONAL_THEMES } from '../utils/personalThemes'
import { useMoonPhase } from '../context/MoonPhaseContext'

function ThemePicker() {
  const { themeKey, selectTheme } = useMoonPhase()

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Object.entries(PERSONAL_THEMES).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => selectTheme(key)}
          className={`px-4 py-2 rounded-full text-sm border transition ${
            themeKey === key
              ? 'border-current font-semibold'
              : 'border-current/20 opacity-60 hover:opacity-100'
          }`}
        >
          {theme.label}
        </button>
      ))}
    </div>
  )
}

export default ThemePicker