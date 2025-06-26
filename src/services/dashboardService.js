import api from './api'

/**
 * Service spécialisé pour le Dashboard avec données réelles
 */
export class DashboardService {
  
  /**
   * Récupère les données COVID par période
   */
  static async getCovidDataByPeriod(period = '30d', limit = 1000) {
    try {
      // Utiliser l'endpoint existant sans filtrage côté API
      const response = await api.get('/data')
      let data = response.data || []
      
      if (!Array.isArray(data)) return []

      // Filtrer côté client selon la période
      const now = new Date()
      let filteredData = data.filter(item => {
        const itemDate = new Date(item.date_reported || item.date || item.Date_reported)
        if (isNaN(itemDate.getTime())) return false
        
        const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24)
        
        switch (period) {
          case '7d': return daysDiff <= 7
          case '30d': return daysDiff <= 30
          case '3m': return daysDiff <= 90
          case '1y': return daysDiff <= 365
          default: return daysDiff <= 30
        }
      })

      // Limiter le nombre de résultats
      return filteredData.slice(-limit)
    } catch (error) {
      console.error('Erreur récupération données COVID:', error)
      return []
    }
  }

  /**
   * Récupère les données par pays
   */
  static async getDataByCountry(country, limit = 100) {
    try {
      const params = new URLSearchParams({
        country: country,
        page_size: limit.toString(),
        page: '1'
      })

      const response = await api.get(`/data?${params}`)
      return response.data || []
    } catch (error) {
      console.error(`Erreur données pour ${country}:`, error)
      return []
    }
  }

  /**
   * Calcule les KPI à partir des données
   */
  static calculateKPIs(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        totalCases: 0,
        totalDeaths: 0,
        casesChange: 0,
        deathsChange: 0,
        activeCases: 0,
        recoveryRate: 0
      }
    }

    // Trier par date
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.date_reported || a.date || a.Date_reported)
      const dateB = new Date(b.date_reported || b.date || b.Date_reported)
      return dateA - dateB
    })

    // Totaux
    const totalCases = sortedData.reduce((sum, item) => {
      return sum + (item.new_cases || item.New_cases || 0)
    }, 0)

    const totalDeaths = sortedData.reduce((sum, item) => {
      return sum + (item.new_deaths || item.New_deaths || 0)
    }, 0)

    // Calcul changement hebdomadaire
    const recentWeek = sortedData.slice(-7)
    const previousWeek = sortedData.slice(-14, -7)

    const recentCases = recentWeek.reduce((sum, item) => 
      sum + (item.new_cases || item.New_cases || 0), 0
    )
    const previousCases = previousWeek.reduce((sum, item) => 
      sum + (item.new_cases || item.New_cases || 0), 0
    )

    const recentDeaths = recentWeek.reduce((sum, item) => 
      sum + (item.new_deaths || item.New_deaths || 0), 0
    )
    const previousDeaths = previousWeek.reduce((sum, item) => 
      sum + (item.new_deaths || item.New_deaths || 0), 0
    )

    const casesChange = previousCases > 0 ? 
      ((recentCases - previousCases) / previousCases * 100) : 0

    const deathsChange = previousDeaths > 0 ? 
      ((recentDeaths - previousDeaths) / previousDeaths * 100) : 0

    return {
      totalCases,
      totalDeaths,
      casesChange: parseFloat(casesChange.toFixed(1)),
      deathsChange: parseFloat(deathsChange.toFixed(1)),
      activeCases: recentCases,
      recoveryRate: totalCases > 0 ? ((totalCases - totalDeaths) / totalCases * 100).toFixed(1) : 0
    }
  }

  /**
   * Prépare les données pour les graphiques
   */
  static prepareChartData(data, field = 'new_cases') {
    if (!Array.isArray(data) || data.length === 0) {
      return { labels: [], data: [] }
    }

    // Trier par date
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.date_reported || a.date || a.Date_reported)
      const dateB = new Date(b.date_reported || b.date || b.Date_reported)
      return dateA - dateB
    })

    // Grouper par date si nécessaire (agrégation quotidienne)
    const groupedData = {}
    sortedData.forEach(item => {
      const date = item.date_reported || item.date || item.Date_reported
      const dateKey = new Date(date).toISOString().split('T')[0]
      
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = 0
      }
      
      groupedData[dateKey] += (item[field] || item[field.charAt(0).toUpperCase() + field.slice(1)] || 0)
    })

    const labels = Object.keys(groupedData).map(date => {
      return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    })

    const chartData = Object.values(groupedData)

    return { labels, data: chartData }
  }

  /**
   * Récupère les données par région/pays pour la carte
   */
  static async getDataByRegion() {
    try {
      const response = await api.get('/data')
      const data = response.data || []

      // Grouper par pays
      const countryData = {}
      data.forEach(item => {
        const country = item.country || item.Country || 'Unknown'
        if (!countryData[country]) {
          countryData[country] = {
            country,
            totalCases: 0,
            totalDeaths: 0,
            recentCases: 0
          }
        }
        
        countryData[country].totalCases += (item.new_cases || item.New_cases || 0)
        countryData[country].totalDeaths += (item.new_deaths || item.New_deaths || 0)
        
        // Cases récents (7 derniers jours)
        const itemDate = new Date(item.date_reported || item.date)
        const now = new Date()
        const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24)
        
        if (daysDiff <= 7) {
          countryData[country].recentCases += (item.new_cases || item.New_cases || 0)
        }
      })

      return Object.values(countryData)
    } catch (error) {
      console.error('Erreur données par région:', error)
      return []
    }
  }

  /**
   * Récupère un résumé des collections disponibles
   */
  static async getCollectionsSummary() {
    try {
      const response = await api.get('/etl/collections')
      return response.data?.collections || []
    } catch (error) {
      console.error('Erreur collections:', error)
      return []
    }
  }

  /**
   * Récupère les statistiques globales
   */
  static async getGlobalStats() {
    try {
      // Récupérer les données récentes
      const recentData = await this.getCovidDataByPeriod('30d', 10000)
      const kpis = this.calculateKPIs(recentData)
      
      // Ajouter des stats ML si disponible
      const collections = await this.getCollectionsSummary()
      
      return {
        ...kpis,
        dataPoints: recentData.length,
        collections: collections.length,
        lastUpdate: recentData.length > 0 ? 
          new Date(recentData[recentData.length - 1].date_reported || recentData[recentData.length - 1].date).toLocaleDateString('fr-FR') : 
          'N/A'
      }
    } catch (error) {
      console.error('Erreur stats globales:', error)
      return {
        totalCases: 0,
        totalDeaths: 0,
        casesChange: 0,
        deathsChange: 0,
        dataPoints: 0,
        collections: 0,
        lastUpdate: 'N/A'
      }
    }
  }

  /**
   * Récupère les données pour une prédiction par défaut
   */
  static getDefaultPredictionData(country = 'France') {
    const today = new Date()
    return {
      country,
      date: today.toISOString().split('T')[0],
      new_cases: 1000,
      people_vaccinated: 50000000,
      new_tests: 100000,
      daily_occupancy_hosp: 2000
    }
  }
}

export default DashboardService