import { useState, useEffect } from 'react'
import DreamForm from '../components/DreamForm'
import DreamCard from '../components/DreamCard'
import { useAuth } from '../context/AuthContext'
import { fetchDreams, createDream, updateDreamApi, deleteDreamApi } from '../utils/dreamsApi'

function DreamJournal() {
  const { user } = useAuth()
  const [dreams, setDreams] = useState([])
  const [editingDream, setEditingDream] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    fetchDreams()
      .then((data) => setDreams(data.map((d) => ({ ...d, id: d._id }))))
      .catch(() => setError('Failed to load dreams.'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleSave(data) {
    try {
      if (editingDream) {
        const updated = await updateDreamApi(editingDream.id, data)
        setDreams((prev) => prev.map((d) => (d.id === editingDream.id ? { ...updated, id: updated._id } : d)))
        setEditingDream(null)
      } else {
        const created = await createDream(data)
        setDreams((prev) => [{ ...created, id: created._id }, ...prev])
      }
    } catch (err) {
      setError('Failed to save dream. Please try again.')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteDreamApi(id)
      setDreams((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      setError('Failed to delete dream. Please try again.')
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--moon-accent)' }}>🌙 Please log in</h1>
        <p className="opacity-60">Log in or sign up to record your dreams.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-24 opacity-50">Loading your dreams...</div>
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--moon-accent)' }}>
          Dream Journal
      </h1>

      {error && (
        <p className="text-sm text-center p-2 rounded-lg mb-4" style={{ backgroundColor: 'rgba(220,38,38,0.15)', color: '#f87171' }}>
          {error}
        </p>
      )}

      <DreamForm
        key={editingDream?.id || 'new'}
        onSave={handleSave}
        initialData={editingDream}
        onCancel={editingDream ? () => setEditingDream(null) : null}
      />

      <div className="mt-10 space-y-4">
        {dreams.length === 0 ? (
          <p className="text-center opacity-40">No dreams recorded yet. What did you dream last night? 🌙</p>
        ) : (
          dreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} onEdit={setEditingDream} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  )
}

export default DreamJournal
