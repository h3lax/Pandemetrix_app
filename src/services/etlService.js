import api from './api'

const API_BASE_URL = 'http://127.0.0.1:5000/api'

export const uploadCSV = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(
      '/etl/upload',
      {formData, title},
      {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    console.error('Erreur upload CSV:', error)
    throw error
  }
}

export const downloadFromUrl = async (url, filename = null) => {
  try {
    const response = await api.post('/etl/url', {
      url,
      filename
    })

    return response.data
  } catch (error) {
    console.error('Erreur téléchargement URL:', error)
    throw new Error(`Erreur téléchargement: ${error.response?.status || error.message}`)
  }
}

export const getETLJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/etl/jobs`)
    
    if (!response.ok) {
      throw new Error(`Erreur récupération jobs: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur récupération jobs ETL:', error)
    throw error
  }
}

export const deleteETLJob = async (jobId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/etl/jobs/${jobId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error(`Erreur suppression: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur suppression job ETL:', error)
    throw error
  }
}