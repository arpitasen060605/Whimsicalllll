import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// Automatically attach the saved token to every request, if one exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('moonmuse_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api