import api from './api'

export class DashboardService {

  static async getCovidDataByPeriod(period = '30d', limit = 1000) {
    try {
      console.log(`Récupération données ${period} depuis MongoDB`)

      // Calculer la date de début selon la période
      const endDate = new Date()
      const startDate = new Date()

      switch (period) {
        case '7d': startDate.setDate(endDate.getDate() - 7); break;
        case '30d': startDate.setDate(endDate.getDate() - 30); break;
        case '3m': startDate.setMonth(endDate.getMonth() - 3); break;
        case '1y': startDate.setFullYear(endDate.getFullYear() - 1); break;
        default: startDate.setDate(endDate.getDate() - 30);
      }

      const params = new URLSearchParams({
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        page_size: limit,
        page: 1
      })

      const response = await fetch(`http://localhost:5000/api/data?${params}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      console.log('Données MongoDB reçues:', {
        length: data.length,
        countries: [...new Set(data.map(d => d.country))],
        dateRange: data.length > 0 ? {
          first: data[0]?.date,
          last: data[data.length - 1]?.date
        } : null
      })

      if (!Array.isArray(data) || data.length === 0) {
        console.log('Aucune donnée MongoDB, fallback vers données de test')
        return this.generateDiverseTestData()
      }

      return data

    } catch (error) {
      console.error('Erreur récupération MongoDB:', error)
      return this.generateDiverseTestData()
    }
  }

  static filterDataByPeriod(data, period) {
    const now = new Date()

    return data.filter(item => {
      const dateStr = item.date_reported || item.date || item.Date_reported || item.created_at
      if (!dateStr) return false

      const itemDate = new Date(dateStr)
      if (isNaN(itemDate.getTime())) return false

      const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24)

      switch (period) {
        case '7d': return daysDiff >= 0 && daysDiff <= 7
        case '30d': return daysDiff >= 0 && daysDiff <= 30
        case '3m': return daysDiff >= 0 && daysDiff <= 90
        case '1y': return daysDiff >= 0 && daysDiff <= 365
        default: return daysDiff >= 0 && daysDiff <= 30
      }
    })
  }

  static async getDataByCountry(country, limit = 100) {
    try {
      const response = await api.get('/data', {
        params: { country, page_size: limit, page: 1 }
      })
      return response.data || []
    } catch (error) {
      console.error(`Erreur données pour ${country}:`, error)
      return []
    }
  }

  static generateTestDataFromCollections() {
    const data = []
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      data.push({
        date_reported: date.toISOString().split('T')[0],
        country: 'France',
        new_cases: Math.floor(Math.random() * 10000) + 5000,
        new_deaths: Math.floor(Math.random() * 100) + 50,
        Date_reported: date.toISOString().split('T')[0],
        New_cases: Math.floor(Math.random() * 10000) + 5000,
        New_deaths: Math.floor(Math.random() * 100) + 50
      })
    }

    return data
  }

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

    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.date_reported || a.date || a.Date_reported)
      const dateB = new Date(b.date_reported || b.date || b.Date_reported)
      return dateA - dateB
    })

    const totalCases = sortedData.reduce((sum, item) =>
      sum + (item.new_cases || item.New_cases || 0), 0)
    const totalDeaths = sortedData.reduce((sum, item) =>
      sum + (item.new_deaths || item.New_deaths || 0), 0)

    const recentWeek = sortedData.slice(-7)
    const previousWeek = sortedData.slice(-14, -7)

    const recentCases = recentWeek.reduce((sum, item) =>
      sum + (item.new_cases || item.New_cases || 0), 0)
    const previousCases = previousWeek.reduce((sum, item) =>
      sum + (item.new_cases || item.New_cases || 0), 0)

    const casesChange = previousCases > 0 ?
      ((recentCases - previousCases) / previousCases * 100) : 0

    return {
      totalCases,
      totalDeaths,
      casesChange: parseFloat(casesChange.toFixed(1)),
      deathsChange: 0,
      activeCases: recentCases,
      recoveryRate: totalCases > 0 ? ((totalCases - totalDeaths) / totalCases * 100).toFixed(1) : 0
    }
  }

  static prepareChartData(data, field = 'new_cases') {
    if (!Array.isArray(data) || data.length === 0) {
      return { labels: [], data: [] }
    }

    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.date_reported || a.date || a.Date_reported)
      const dateB = new Date(b.date_reported || b.date || b.Date_reported)
      return dateA - dateB
    })

    const groupedData = {}
    sortedData.forEach(item => {
      const date = item.date_reported || item.date || item.Date_reported
      const dateKey = new Date(date).toISOString().split('T')[0]

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = 0
      }

      groupedData[dateKey] += (item[field] || item[field.charAt(0).toUpperCase() + field.slice(1)] || 0)
    })

    const labels = Object.keys(groupedData).map(date =>
      new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }))

    return { labels, data: Object.values(groupedData) }
  }

  static async getCollectionsSummary() {
    try {
      const response = await api.get('/etl/collections')
      return response.data?.collections || []
    } catch (error) {
      console.error('Erreur collections:', error)
      return []
    }
  }

  static async getGlobalStats() {
    try {
      const recentData = await this.getCovidDataByPeriod('30d', 10000)
      const kpis = this.calculateKPIs(recentData)
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

  static async getCountryStats() {
    try {
      const response = await fetch('http://localhost:5000/api/data?page_size=5000')
      const data = await response.json()

      // Grouper par pays
      const stats = {}
      data.forEach(item => {
        const country = item.country
        if (!stats[country]) {
          stats[country] = {
            totalCases: 0,
            totalDeaths: 0,
            latestDate: item.date
          }
        }

        stats[country].totalCases += parseInt(item.new_cases || 0)
        stats[country].totalDeaths += parseInt(item.new_deaths || 0)

        // Garder la date la plus récente
        if (item.date > stats[country].latestDate) {
          stats[country].latestDate = item.date
        }
      })

      return stats
    } catch (error) {
      console.error('Erreur stats pays:', error)
      return {}
    }
  }

  static async getAllCountries() {
    try {
      const response = await fetch('http://localhost:5000/api/data/countries')
      const data = await response.json()

      console.log('Pays disponibles:', data.total_countries, 'pays trouvés')
      return data.countries
    } catch (error) {
      console.error('Erreur récupération pays:', error)
      return []
    }
  }
}

export default DashboardService