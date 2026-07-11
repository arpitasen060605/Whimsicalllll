import DailyMuse from '../components/DailyMuse'

function Home() {
  return (
    <div className="text-center mt-20 px-4">
      <h1 className="text-5xl font-bold" style={{ color: 'var(--moon-accent)' }}>
        🌙 Welcome to MoonMuse
      </h1>
      <p className="mt-4 mb-8 opacity-70">Where thoughts bloom under moonlight.</p>
      <DailyMuse />
    </div>
  )
}

export default Home