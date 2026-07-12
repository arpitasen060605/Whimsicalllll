import api from './api'

export async function fetchDreams() {
  const res = await api.get('/dreams')
  return res.data
}

export async function createDream(dream) {
  const res = await api.post('/dreams', dream)
  return res.data
}

export async function updateDreamApi(id, updates) {
  const res = await api.put(`/dreams/${id}`, updates)
  return res.data
}

export async function deleteDreamApi(id) {
  await api.delete(`/dreams/${id}`)
  return id
}