import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/journal', label: 'Journal' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dreams', label: 'Dreams' },
]

function Navbar() {
  return (
    <nav className="flex justify-center gap-6 py-4 border-b border-lavender/20">
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
    </nav>
  )
}

export default Navbar