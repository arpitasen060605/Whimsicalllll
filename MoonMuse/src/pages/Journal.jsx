import { useState, useEffect } from 'react'
import EntryForm from '../components/EntryForm'
import EntryCard from '../components/EntryCard'
import { getEntries, addEntry, updateEntry, deleteEntry } from '../utils/storage'

function Journal() {
  const [entries, setEntries] = useState([])
  const [editingEntry, setEditingEntry] = useState(null)

  useEffect(() => {
    setEntries(getEntries())
  }, [])

  function handleSave(data) {
    if (editingEntry) {
      const updated = updateEntry(editingEntry.id, data)
      setEntries(updated)
      setEditingEntry(null)
    } else {
      const updated = addEntry(data)
      setEntries(updated)
    }
  }

  function handleDelete(id) {
    const updated = deleteEntry(id)
    setEntries(updated)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-lavender text-center mb-8">📖 Daily Journal</h1>

      <EntryForm
  key={editingEntry?.id || 'new'}
  onSave={handleSave}
  initialData={editingEntry}
  onCancel={editingEntry ? () => setEditingEntry(null) : null}
/>

      <div className="mt-10 space-y-4">
        {entries.length === 0 ? (
          <p className="text-center text-moonlight/40">No entries yet. Write your first one above 🌙</p>
        ) : (
          entries.map((entry) => (
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