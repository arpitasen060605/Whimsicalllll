import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        await signup(username, email, password)
      } else {
        await login(email, password)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl p-6"
        style={{ backgroundColor: 'var(--moon-bg)', border: '1px solid var(--moon-accent)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--moon-accent)' }}>
            {mode === 'login' ? 'Welcome Back🌙' : ' Join MoonMuse🌙'}
          </h2>
          <button onClick={onClose} className="opacity-60 hover:opacity-100 text-xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.15)', color: '#f87171' }}>
              {error}
            </p>
          )}

          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
              style={{ borderColor: 'var(--moon-accent)' }}
            />
          )}
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
            placeholder={mode === 'signup' ? 'Password (min. 6 characters)' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={mode === 'signup' ? 6 : undefined}
            className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
            style={{ borderColor: 'var(--moon-accent)' }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)' }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm opacity-60 mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            className="hover:underline"
            style={{ color: 'var(--moon-accent)' }}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthModal