import { useState, useEffect, useMemo } from 'react'
import EntryForm from '../components/EntryForm'
import EntryCard from '../components/EntryCard'
import { getEntries, addEntry, updateEntry, deleteEntry } from '../utils/storage'

function Journal() {
  const [entries, setEntries] = useState([])
  const [editingEntry, setEditingEntry] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-lavender text-center mb-8">📖 Daily Journal</h1>

      <EntryForm
        key={editingEntry?.id || 'new'}
        onSave={handleSave}
        initialData={editingEntry}
        onCancel={editingEntry ? () => setEditingEntry(null) : null}
      />

      <div className="mt-10 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by title, mood, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border border-lavender/30 rounded-lg px-4 py-2 text-moonlight placeholder:text-moonlight/40 focus:outline-none focus:border-lavender"
        />
      </div>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <p className="text-center text-moonlight/40">
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