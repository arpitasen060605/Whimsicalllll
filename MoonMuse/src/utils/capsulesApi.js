import api from './api'

export async function fetchCapsules() {
  const res = await api.get('/capsules')
  return res.data
}

export async function createCapsule(capsule) {
  const res = await api.post('/capsules', capsule)
  return res.data
}

export async function markCapsuleReadApi(id) {
  const res = await api.put(`/capsules/${id}/read`)
  return res.data
}

export async function deleteCapsuleApi(id) {
  await api.delete(`/capsules/${id}`)
  return id
}