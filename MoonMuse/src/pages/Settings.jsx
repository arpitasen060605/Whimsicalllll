import ThemePicker from '../components/ThemePicker'

function Settings() {
  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--moon-accent)' }}>
          Themes
      </h1>
      <p className="opacity-60 mb-8 text-sm">
        Choose the look and feel of your MoonMuse space.
      </p>
      <ThemePicker />
    </div>
  )
}

export default Settings