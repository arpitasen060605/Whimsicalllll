import { useState, useEffect, useMemo } from 'react'
import EntryForm from '../components/EntryForm'
import EntryCard from '../components/EntryCard'
import DailyMuse from '../components/DailyMuse'
import { useAuth } from '../context/AuthContext'
import { fetchEntries, createEntry, updateEntryApi, deleteEntryApi } from '../utils/entriesApi'

function Journal() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [editingEntry, setEditingEntry] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetchEntries()
      .then((data) => {
        // Normalize _id to id so existing components (which expect `id`) keep working
        setEntries(data.map((e) => ({ ...e, id: e._id })))
      })
      .catch(() => setError('Failed to load entries.'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleSave(data) {
    try {
      if (editingEntry) {
        const updated = await updateEntryApi(editingEntry.id, data)
        setEntries((prev) =>
          prev.map((e) => (e.id === editingEntry.id ? { ...updated, id: updated._id } : e))
        )
        setEditingEntry(null)
      } else {
        const created = await createEntry(data)
        setEntries((prev) => [{ ...created, id: created._id }, ...prev])
      }
    } catch (err) {
      setError('Failed to save entry. Please try again.')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteEntryApi(id)
      setEntries((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      setError('Failed to delete entry. Please try again.')
    }
  }

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return entries

    return entries.filter((entry) => {
      const inTitle = entry.title.toLowerCase().includes(query)
      const inContent = entry.content.toLowerCase().includes(query)
      const inMood = entry.mood.toLowerCase().includes(query)
      const inTags = entry.tags?.some((tag) => tag.includes(query))
      return inTitle || inContent || inMood || inTags
    })
  }, [entries, searchQuery])

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--moon-accent)' }}>
          🌙 Please log in
        </h1>
        <p className="opacity-60">Log in or sign up to start writing your journal.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-24 opacity-50">Loading your journal...</div>
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--moon-accent)' }}>
          Daily Journal
      </h1>

      <DailyMuse />

      {error && (
        <p className="text-sm text-center p-2 rounded-lg mb-4" style={{ backgroundColor: 'rgba(220,38,38,0.15)', color: '#f87171' }}>
          {error}
        </p>
      )}

      <EntryForm
        key={editingEntry?.id || 'new'}
        onSave={handleSave}
        initialData={editingEntry}
        onCancel={editingEntry ? () => setEditingEntry(null) : null}
      />

      <div className="mt-10 mb-4">
        <input
          type="text"
          placeholder=" Search by title, mood, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border rounded-lg px-4 py-2 focus:outline-none"
          style={{ borderColor: 'var(--moon-accent)' }}
        />
      </div>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <p className="text-center opacity-50">
            {entries.length === 0
              ? 'No entries yet. Write your first one above 🌙'
              : 'No entries match your search.'}
          </p>
        ) : (
          filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={setEditingEntry}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Journal