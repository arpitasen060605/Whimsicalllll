import { NavLink } from 'react-router-dom'
import { useMoonPhase } from '../context/MoonPhaseContext'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/journal', label: 'Journal' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dreams', label: 'Dreams' },
  { to: '/settings', label: 'Settings' },
]

function Navbar() {
  const { phase } = useMoonPhase()

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b border-lavender/20">
      <div className="flex gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? 'opacity-100 font-semibold' : 'opacity-60 hover:opacity-90'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--moon-accent)' : 'inherit',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="text-sm opacity-70">
        {phase.emoji} {phase.name}
      </div>
    </nav>
  )
}

export default Navbar