// import api from './api'

// export const fetchData = async (params = {}) => {
//   try {
//     const response = await api.get('/data', { params })
//     return response.data
//   } catch (error) {
//     console.error(error)
//     throw error
//   }
// }

// export const fetchModel = async (id) => {
//   const response = await api.post(`/model/${id}`)
//   return response.data
// }

// src/services/dataServices.js
const API_BASE_URL = 'http://127.0.0.1:5000/api'

export const fetchData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/datasheet`)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error)
    throw error
  }
}

// Fonctions pour vérifier le statut de l'API
export const checkAppStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return await response.json()
  } catch (error) {
    throw new Error('API non disponible')
  }
}

export const checkDbStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/db-check`)
    return await response.json()
  } catch (error) {
    throw new Error('Base de données non disponible')
  }
}