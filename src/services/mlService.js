import api from './api'

/**
 * Service pour les appels ML API
 */
export class MLService {
  
  /**
   * Vérifie l'état du système ML
   */
  static async checkMLHealth() {
    try {
      const response = await api.get('/ml/health')
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
      const response = await api.get('/ml/countries')
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
      const response = await api.get('/ml/model-info')
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
      const response = await api.post('/ml/predict', predictionData)
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
      const response = await api.post('/ml/predict-batch', {
        predictions: predictionsArray
      })
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
      const response = await api.post('/ml/train')
      return response.data
    } catch (error) {
      console.error('Erreur entraînement ML:', error)
      throw error
    }
  }

  /**
   * Crée des données synthétiques pour test
   */
  static async createSyntheticData() {
    try {
      const response = await api.post('/ml/create-synthetic-data')
      return response.data
    } catch (error) {
      console.error('Erreur création données synthétiques:', error)
      throw error
    }
  }


    /**
   * Charge les CSV existants vers MongoDB
   */
  static async loadCSVData() {
    try {
      const response = await api.post('/ml/load-csv-data')
      return response.data
    } catch (error) {
      console.error('Erreur chargement CSV:', error)
      throw error
    }
  }

  /**
   * Recharge le modèle
   */
  static async reloadModel() {
    try {
      const response = await api.post('/ml/load-model')
      return response.data
    } catch (error) {
      console.error('Erreur rechargement modèle:', error)
      throw error
    }
  }

  /**
   * Génère des données de prédiction pour une période
   */
  static generatePredictionData(country, startDate, days = 7) {
    const predictions = []
    const baseDate = new Date(startDate)
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(baseDate)
      currentDate.setDate(currentDate.getDate() + i)
      
      predictions.push({
        country: country,
        date: currentDate.toISOString().split('T')[0],
        new_cases: Math.floor(Math.random() * 1000) + 500, // Simulation
        people_vaccinated: 50000000 + (i * 10000),
        new_tests: Math.floor(Math.random() * 50000) + 75000,
        daily_occupancy_hosp: Math.floor(Math.random() * 1000) + 2000
      })
    }
    
    return predictions
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