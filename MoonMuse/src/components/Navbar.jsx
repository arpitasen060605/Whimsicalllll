import { NavLink } from 'react-router-dom'
import { useMoonPhase } from '../context/MoonPhaseContext'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/journal', label: 'Journal' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dreams', label: 'Dreams' },
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
                isActive ? 'text-lavender' : 'text-moonlight/60 hover:text-moonlight'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="text-sm text-moonlight/60">
        {phase.emoji} {phase.name}
      </div>
    </nav>
  )
}

export default Navbar