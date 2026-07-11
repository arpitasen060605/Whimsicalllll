import { Link } from 'react-router-dom'
import ThemePicker from '../components/ThemePicker'

function Settings() {
  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--moon-accent)' }}>
        🎨 Themes
      </h1>
      <p className="opacity-60 mb-8 text-sm">
        Choose the look and feel of your MoonMuse space.
      </p>
      <ThemePicker />

      <div className="mt-12 pt-8 border-t" style={{ borderColor: 'rgba(128,128,128,0.2)' }}>
        <Link
          to="/export"
          className="text-sm px-5 py-2 rounded-full border inline-block hover:opacity-100 opacity-80 transition"
          style={{ borderColor: 'var(--moon-accent)' }}
        >
          📤 Export & Backup Your Journal
        </Link>
      </div>
    </div>
  )
}

export default Settings