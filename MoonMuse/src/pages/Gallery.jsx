import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchEntries } from '../utils/entriesApi'
import { collectAllMedia } from '../utils/collectMedia'
import PolaroidCard from '../components/PolaroidCard'

function Gallery() {
  const { user } = useAuth()
  const [mediaItems, setMediaItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    fetchEntries()
      .then((data) => {
        const entries = data.map((e) => ({ ...e, id: e._id }))
        setMediaItems(collectAllMedia(entries))
      })
      .catch(() => setMediaItems([]))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--moon-accent)' }}>🌙 Please log in</h1>
        <p className="opacity-60">Log in to see your memory wall.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-24 opacity-50">Gathering your memories...</div>
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--moon-accent)' }}>
        📸 Polaroid Gallery
      </h1>
      <p className="text-center opacity-60 text-sm mb-10">
        Every photo and video from your journal, all in one place
      </p>

      {mediaItems.length === 0 ? (
        <p className="text-center opacity-40 py-16">
          No photos or videos yet — attach some to your journal entries to start building your wall 🌙
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10 justify-items-center">
          {mediaItems.map((item, index) => (
            <PolaroidCard key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Gallery