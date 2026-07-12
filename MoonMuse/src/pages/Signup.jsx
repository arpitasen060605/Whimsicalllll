import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signup(username, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--moon-accent)' }}>
         Join MoonMuse🌙
      </h1>
      <p className="text-center opacity-60 mb-8 text-sm">Start your reflection journey</p>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 space-y-4"
        style={{ backgroundColor: 'var(--moon-surface)' }}
      >
        {error && (
          <p className="text-sm text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.15)', color: '#f87171' }}>
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
          style={{ borderColor: 'var(--moon-accent)' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
          style={{ borderColor: 'var(--moon-accent)' }}
        />
        <input
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
          style={{ borderColor: 'var(--moon-accent)' }}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)' }}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center text-sm opacity-60 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="hover:underline" style={{ color: 'var(--moon-accent)' }}>
          Log in
        </Link>
      </p>
    </div>
  )
}

export default Signup