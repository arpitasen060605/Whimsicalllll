import { useState, useEffect } from 'react'
import CapsuleForm from '../components/CapsuleForm'
import CapsuleCard from '../components/CapsuleCard'
import { useAuth } from '../context/AuthContext'
import { fetchCapsules, createCapsule, markCapsuleReadApi, deleteCapsuleApi } from '../utils/capsulesApi'

function TimeCapsules() {
  const { user } = useAuth()
  const [capsules, setCapsules] = useState([])
  const [activeTab, setActiveTab] = useState('letter')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    fetchCapsules()
      .then((data) => setCapsules(data.map((c) => ({ ...c, id: c._id }))))
      .catch(() => setError('Failed to load capsules.'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleSave(data) {
    try {
      const created = await createCapsule(data)
      setCapsules((prev) => [{ ...created, id: created._id }, ...prev])
      setShowForm(false)
    } catch (err) {
      setError('Failed to save. Please try again.')
    }
  }

  async function handleOpen(id) {
    try {
      const updated = await markCapsuleReadApi(id)
      setCapsules((prev) => prev.map((c) => (c.id === id ? { ...updated, id: updated._id } : c)))
    } catch (err) {
      setError('Failed to update. Please try again.')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCapsuleApi(id)
      setCapsules((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError('Failed to delete. Please try again.')
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--moon-accent)' }}>🌙 Please log in</h1>
        <p className="opacity-60">Log in or sign up to write letters and bury time capsules.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-24 opacity-50">Loading...</div>
  }

  const filtered = capsules.filter((c) => c.type === activeTab)

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--moon-accent)' }}>
        💌 Letters & ⏳ Time Capsules
      </h1>

      {error && (
        <p className="text-sm text-center p-2 rounded-lg mb-4" style={{ backgroundColor: 'rgba(220,38,38,0.15)', color: '#f87171' }}>
          {error}
        </p>
      )}

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { setActiveTab('letter'); setShowForm(false) }}
          className="px-4 py-2 rounded-full text-sm border transition"
          style={
            activeTab === 'letter'
              ? { backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)', borderColor: 'var(--moon-accent)' }
              : { borderColor: 'var(--moon-accent)', opacity: 0.6 }
          }
        >
          💌 Letters to Future Self
        </button>
        <button
          onClick={() => { setActiveTab('capsule'); setShowForm(false) }}
          className="px-4 py-2 rounded-full text-sm border transition"
          style={
            activeTab === 'capsule'
              ? { backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)', borderColor: 'var(--moon-accent)' }
              : { borderColor: 'var(--moon-accent)', opacity: 0.6 }
          }
        >
          ⏳ Time Capsules
        </button>
      </div>

      {!showForm ? (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2 rounded-lg font-medium hover:opacity-90"
            style={{ backgroundColor: 'var(--moon-accent)', color: 'var(--moon-bg)' }}
          >
            {activeTab === 'letter' ? '+ Write a Letter' : '+ Bury a Capsule'}
          </button>
        </div>
      ) : (
        <div className="mb-8">
          <CapsuleForm type={activeTab} onSave={handleSave} />
          <div className="text-center mt-3">
            <button onClick={() => setShowForm(false)} className="text-sm opacity-60 hover:opacity-100">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center opacity-40">
            {activeTab === 'letter'
              ? 'No letters yet. Write one to your future self 💌'
              : 'No capsules buried yet. Preserve a memory or goal ⏳'}
          </p>
        ) : (
          filtered.map((capsule) => (
            <CapsuleCard key={capsule.id} capsule={capsule} onOpen={handleOpen} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  )
}

export default TimeCapsules