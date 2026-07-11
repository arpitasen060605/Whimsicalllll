import { useState, useEffect } from 'react'
import CapsuleForm from '../components/CapsuleForm'
import CapsuleCard from '../components/CapsuleCard'
import { getCapsules, addCapsule, markAsRead, deleteCapsule } from '../utils/capsuleStorage'

function TimeCapsules() {
  const [capsules, setCapsules] = useState([])
  const [activeTab, setActiveTab] = useState('letter')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setCapsules(getCapsules())
  }, [])

  function handleSave(data) {
    const updated = addCapsule(data)
    setCapsules(updated)
    setShowForm(false)
  }

  function handleOpen(id) {
    const updated = markAsRead(id)
    setCapsules(updated)
  }

  function handleDelete(id) {
    const updated = deleteCapsule(id)
    setCapsules(updated)
  }

  const filtered = capsules.filter((c) => c.type === activeTab)

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--moon-accent)' }}>
        💌 Letters & ⏳ Time Capsules
      </h1>

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