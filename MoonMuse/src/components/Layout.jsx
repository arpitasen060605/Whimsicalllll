import Navbar from './Navbar'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-midnight text-moonlight">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default Layout