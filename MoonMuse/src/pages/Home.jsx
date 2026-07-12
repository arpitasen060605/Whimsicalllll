import { Link } from 'react-router-dom'
import NightSkyHero from '../components/NightSkyHero'
import LakeScene from '../components/LakeScene'
import DailyMuse from '../components/DailyMuse'
import { useMoonPhase } from '../context/MoonPhaseContext'

function Home() {
  const { phase } = useMoonPhase()

  return (
    <div>
      {/* Hero section */}
      <div className="relative overflow-hidden" style={{ minHeight: '480px' }}>
        <NightSkyHero />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4 pt-24 pb-16">
          <p className="text-sm uppercase tracking-widest opacity-70 mb-3">
            {phase.emoji} Tonight's sky: {phase.name}
          </p>
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--moon-accent)' }}>
            🌙 MoonMuse
          </h1>
          <p className="text-lg opacity-80 mb-8">Where thoughts bloom under moonlight.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/journal"
              className="px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
              style={{ backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)' }}
            >
              Start Journaling
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-full font-medium border hover:opacity-100 opacity-80 transition"
              style={{ borderColor: 'var(--moon-accent)' }}
            >
              View Your Journey
            </Link>
          </div>
        </div>
      </div>

      {/* Muse section */}
      <div className="px-4 -mt-6 relative z-10 mb-4">
        <DailyMuse />
      </div>

      {/* Lake scene */}
      <LakeScene />
    </div>
  )
}

export default Home