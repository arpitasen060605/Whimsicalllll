const STORAGE_KEY = 'moonmuse_dreams'

export function getDreams() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveDreams(dreams) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams))
}

export function addDream(dream) {
  const dreams = getDreams()
  const newDream = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...dream,
  }
  const updated = [newDream, ...dreams]
  saveDreams(updated)
  return updated
}

export function updateDream(id, updates) {
  const dreams = getDreams()
  const updated = dreams.map((d) => (d.id === id ? { ...d, ...updates } : d))
  saveDreams(updated)
  return updated
}

export function deleteDream(id) {
  const dreams = getDreams()
  const updated = dreams.filter((d) => d.id !== id)
  saveDreams(updated)
  return updated
}