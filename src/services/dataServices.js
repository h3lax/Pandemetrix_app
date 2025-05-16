import api from './api'

export const fetchData = async (params = {}) => {
  try {
    const response = await api.get('/data', { params })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const fetchModel = async (id) => {
  const response = await api.post(`/model/${id}`)
  return response.data
}