import api from './api'

export async function fetchEntries() {
  const res = await api.get('/entries')
  return res.data
}

export async function createEntry(entry) {
  const res = await api.post('/entries', entry)
  return res.data
}

export async function updateEntryApi(id, updates) {
  const res = await api.put(`/entries/${id}`, updates)
  return res.data
}

export async function deleteEntryApi(id) {
  await api.delete(`/entries/${id}`)
  return id
}