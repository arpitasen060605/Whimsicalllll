import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useMoonPhase } from '../context/MoonPhaseContext'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/journal', label: 'Journal' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/capsules', label: 'Capsules' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dreams', label: 'Dreams' },
  { to: '/settings', label: 'Settings' },
]

function Navbar() {
  const { phase } = useMoonPhase()
  const { user, logout } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
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

        <div className="flex items-center gap-4">
          <span className="text-sm opacity-70">{phase.emoji} {phase.name}</span>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-sm px-3 py-1 rounded-full border hover:opacity-100 opacity-80"
                style={{ borderColor: 'var(--moon-accent)' }}
              >
                👤 {user.username}
              </button>
              {showMenu && (
                <div
                  className="absolute right-0 mt-2 w-40 rounded-lg overflow-hidden border"
                  style={{ backgroundColor: 'var(--moon-bg)', borderColor: 'var(--moon-accent)', zIndex: 200 }}
                >
                  <button
                    onClick={() => { logout(); setShowMenu(false) }}
                    className="w-full text-left px-4 py-2 text-sm hover:opacity-70"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="text-sm px-4 py-1 rounded-full font-medium"
              style={{ backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)' }}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default Navbar