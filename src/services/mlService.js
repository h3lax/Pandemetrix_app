import { etl } from './api'

/**
 * Service pour les appels ML API
 */
export class MLService {

  static BASE_URL = import.meta.env.VITE_ML_API_BASE_URL || 'http://localhost:5001/api/v1/covid'

  /**
   * Vérifie l'état du système ML
   */
  static async checkMLHealth() {
    try {
      const response = await etl.get('/health')
      return response.data
    } catch (error) {
      console.error('Erreur ML health check:', error)
      throw error
    }
  }

  /**
   * Récupère les pays supportés
   */
  static async getSupportedCountries() {
    try {
      const response = await etl.get('/countries')
      return response.data
    } catch (error) {
      console.error('Erreur récupération pays ML:', error)
      throw error
    }
  }

  /**
   * Récupère les informations du modèle
   */
  static async getModelInfo() {
    try {
      const response = await etl.get('/model-info')
      return response.data
    } catch (error) {
      console.error('Erreur info modèle ML:', error)
      throw error
    }
  }

  /**
   * Effectue une prédiction simple
   */
  static async predict(predictionData) {
    try {
      const response = await etl.post('/ml/predict', predictionData)
      return response.data
    } catch (error) {
      console.error('Erreur prédiction ML:', error)
      throw error
    }
  }

  /**
   * Effectue plusieurs prédictions
   */
  static async predictBatch(predictionsArray) {
    try {
      const predictions = Array.isArray(predictionsArray) ? predictionsArray : [predictionsArray]
      const response = await etl.post('/predict-batch', { predictions })
      return response.data
    } catch (error) {
      console.error('Erreur prédiction batch ML:', error)
      throw error
    }
  }

  /**
   * Lance l'entraînement d'un nouveau modèle
   */
  static async trainModel() {
    try {
      const response = await etl.get('/train_model')
      return response.data
    } catch (error) {
      console.error('Erreur entraînement ML:', error)
      throw error
    }
  }

  /**
   * Récupère les pays supportés
   */
  static async getSupportedCountries() {
    try {
      const response = await etl.get('/countries')
      return response.data
    } catch (error) {
      console.error('Erreur récupération pays ML:', error)
      throw error
    }
  }

  /**
   * Récupère les informations du modèle
   */
  static async getModelInfo() {
    try {
      const response = await etl.get('/model-info')
      return response.data
    } catch (error) {
      console.error('Erreur info modèle ML:', error)
      throw error
    }
  }

  /**
   * Effectue une prédiction simple
   */
  static async predict(predictionData) {
    try {
      const response = await etl.post('/ml/predict', predictionData)
      return response.data
    } catch (error) {
      console.error('Erreur prédiction ML:', error)
      throw error
    }
  }

  /**
   * Lance l'entraînement d'un nouveau modèle
   */
  static async trainModel() {
    try {
      const response = await etl.get('/train_model')
      return response.data
    } catch (error) {
      console.error('Erreur entraînement ML:', error)
      throw error
    }
  }

  /**
   * Valide les données de prédiction
   */
  static validatePredictionData(data) {
    const required = ['country', 'date', 'new_cases', 'people_vaccinated', 'new_tests', 'daily_occupancy_hosp']
    const missing = required.filter(field => !data.hasOwnProperty(field))

    if (missing.length > 0) {
      throw new Error(`Champs manquants: ${missing.join(', ')}`)
    }

    if (data.new_cases < 0 || data.people_vaccinated < 0 || data.new_tests < 0 || data.daily_occupancy_hosp < 0) {
      throw new Error('Les valeurs numériques doivent être positives')
    }

    try {
      new Date(data.date).toISOString()
    } catch {
      throw new Error('Format de date invalide (attendu: YYYY-MM-DD)')
    }

    return true
  }
}

export default MLService