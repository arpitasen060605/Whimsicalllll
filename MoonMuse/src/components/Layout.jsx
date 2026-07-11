import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div
      className="min-h-screen text-moonlight transition-colors duration-1500"
      style={{ backgroundColor: 'var(--moon-bg, #0b0c2a)' }}
    >
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default Layout