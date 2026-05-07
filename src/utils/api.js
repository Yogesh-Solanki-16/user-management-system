import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Error handler interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    throw new Error(message)
  }
)

export const fetchUsers = async (limit = 50, skip = 0) => {
  return api.get('/users', { params: { limit, skip } })
}

export const searchUsers = async (query) => {
  return api.get('/users/search', { params: { q: query } })
}

export const fetchUser = async (id) => {
  return api.get(`/users/${id}`)
}

export const createUser = async (userData) => {
  return api.post('/users/add', userData)
}

export const updateUser = async (id, userData) => {
  return api.put(`/users/${id}`, userData)
}

export const deleteUser = async (id) => {
  return api.delete(`/users/${id}`)
}

export default api
