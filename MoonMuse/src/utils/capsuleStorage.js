const STORAGE_KEY = 'moonmuse_capsules'

export function getCapsules() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveCapsules(capsules) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(capsules))
}

export function addCapsule(capsule) {
  const capsules = getCapsules()
  const newCapsule = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isRead: false,
    ...capsule,
  }
  const updated = [newCapsule, ...capsules]
  saveCapsules(updated)
  return updated
}

export function markAsRead(id) {
  const capsules = getCapsules()
  const updated = capsules.map((c) => (c.id === id ? { ...c, isRead: true } : c))
  saveCapsules(updated)
  return updated
}

export function deleteCapsule(id) {
  const capsules = getCapsules()
  const updated = capsules.filter((c) => c.id !== id)
  saveCapsules(updated)
  return updated
}

export function isUnlocked(capsule) {
  return new Date() >= new Date(capsule.unlockDate)
}