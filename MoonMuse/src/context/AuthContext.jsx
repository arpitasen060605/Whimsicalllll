import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('moonmuse_token')
    const savedUser = localStorage.getItem('moonmuse_user')

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  async function signup(username, email, password) {
    const res = await api.post('/auth/signup', { username, email, password })
    localStorage.setItem('moonmuse_token', res.data.token)
    localStorage.setItem('moonmuse_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('moonmuse_token', res.data.token)
    localStorage.setItem('moonmuse_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  function logout() {
    localStorage.removeItem('moonmuse_token')
    localStorage.removeItem('moonmuse_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}