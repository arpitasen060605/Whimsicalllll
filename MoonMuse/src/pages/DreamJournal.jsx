import { useState, useEffect } from 'react'
import DreamForm from '../components/DreamForm'
import DreamCard from '../components/DreamCard'
import { getDreams, addDream, updateDream, deleteDream } from '../utils/dreamStorage'

function DreamJournal() {
  const [dreams, setDreams] = useState([])
  const [editingDream, setEditingDream] = useState(null)

  useEffect(() => {
    setDreams(getDreams())
  }, [])

  function handleSave(data) {
    if (editingDream) {
      const updated = updateDream(editingDream.id, data)
      setDreams(updated)
      setEditingDream(null)
    } else {
      const updated = addDream(data)
      setDreams(updated)
    }
  }

  function handleDelete(id) {
    const updated = deleteDream(id)
    setDreams(updated)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--moon-accent)' }}>
         Dream Journal
      </h1>

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
