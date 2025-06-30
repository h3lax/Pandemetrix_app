import api from './api'

export const fetchData = async (params = {}) => {
   try {
     const response = await api.get('/data')
     return response.data
   } catch (error) {
     console.error(error)
     throw error
   }
}

// export const fetchModel = async (id) => {
//   const response = await api.post(`/model/${id}`)
//   return response.data
// }

// Fonctions pour vérifier le statut de l'API
export const checkAppStatus = async () => {
  try {
    const response = await api.get('/health/status')
    return await response.data
  } catch (error) {
    throw new Error('Api non disponible')
  }
}

export const checkDbStatus = async () => {
  try {
    const response = await api.get('/health/db-check')
    return await response.data
  } catch (error) {
    throw new Error('Base de données non disponible')
  }
}

export const fetchFilteredData = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params)
    const response = await api.get(`/data?${queryParams}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}