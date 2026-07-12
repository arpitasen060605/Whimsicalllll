import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import NightSkyHero from './NightSkyHero'
import { useMoonPhase } from '../context/MoonPhaseContext'

function Layout({ children }) {
  const { personalTheme } = useMoonPhase()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div
      className="min-h-screen transition-all duration-[1500ms] relative"
      style={{
        background: 'var(--moon-bg, #0b0c2a)',
        color: personalTheme.fixed ? personalTheme.text : 'var(--color-moonlight)',
        fontFamily: 'var(--moon-font-body, inherit)',
      }}
    >
      {/* Fixed, faded background sky — only on non-Home pages, since Home has its own full hero */}
      {!isHome && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <NightSkyHero opacity={0.6} />
        </div>
      )}

      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  )
}

export default Layout