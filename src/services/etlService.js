import api from './api'

const API_BASE_URL = 'http://127.0.0.1:5000/api'

export const uploadCSV = async (file, title) => {
  console.log('We arrive in uploadCSV', file, title)
  if (!title) throw new Error('Le titre est requis avant l\'upload.')

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)

    const response = await api.post(
      '/etl/upload',
      formData,
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

export const downloadFromUrl = async (code) => {
  try {
    const response = await api.post('/etl/download', 
      {code}
    )
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