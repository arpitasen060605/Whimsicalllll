const STORAGE_KEY = 'moonmuse_entries'

export function getEntries() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function addEntry(entry) {
  const entries = getEntries()
  const newEntry = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...entry,
  }
  const updated = [newEntry, ...entries]
  saveEntries(updated)
  return updated
}

export function updateEntry(id, updates) {
  const entries = getEntries()
  const updated = entries.map((e) => (e.id === id ? { ...e, ...updates } : e))
  saveEntries(updated)
  return updated
}

export function deleteEntry(id) {
  const entries = getEntries()
  const updated = entries.filter((e) => e.id !== id)
  saveEntries(updated)
  return updated
}