import Navbar from './Navbar'
import { useMoonPhase } from '../context/MoonPhaseContext'

function Layout({ children }) {
  const { personalTheme } = useMoonPhase()

  return (
    <div
      className="min-h-screen transition-all duration-[1500ms]"
      style={{
        background: 'var(--moon-bg, #0b0c2a)',
        color: personalTheme.fixed ? personalTheme.text : 'var(--color-moonlight)',
        fontFamily: 'var(--moon-font-body, inherit)',
      }}
    >
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default Layout