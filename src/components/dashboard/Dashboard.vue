<template>
  <main class="dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">{{ t('dashboard.title') }}</h1>
      <div class="kpi-cards">
        <div class="kpi-card infection">
          <div class="kpi-icon">🦠</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.infectionRate || 'N/A' }}%</span>
            <span class="kpi-label">{{ t('dashboard.infectionRate') }}</span>
            <span class="kpi-trend" :class="casesChangeClass">{{ kpiData?.casesChange || 'N/A' }}%</span>
          </div>
        </div>
        <div class="kpi-card mortality">
          <div class="kpi-icon">💀</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.mortalityRate || 'N/A' }}%</span>
            <span class="kpi-label">{{ t('dashboard.mortalityRate') }}</span>
            <span class="kpi-trend" :class="deathsChangeClass">{{ kpiData?.deathsChange || 'N/A' }}%</span>
          </div>
        </div>
        <div class="kpi-card recovery">
          <div class="kpi-icon">✅</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.recoveryRate || 'N/A' }}%</span>
            <span class="kpi-label">{{ t('dashboard.recoveryRate') }}</span>
            <span class="kpi-trend positive">{{ ((kpiData?.totalCases || 0) - (kpiData?.totalCases || 0) *
              (kpiData?.mortalityRate || 0) / 100).toLocaleString() }} {{ t('dashboard.survivors') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Répartition par région -->
      <section class="map-section">
        <h2>{{ t('dashboard.worldDistribution') }}</h2>
        <div class="world-map-container">
          <div ref="worldMap" class="world-map"></div>
        </div>
      </section>

      <!-- Graphiques avec contrôles -->
      <section class="charts-section">
        <div class="chart-controls">
          <h2>{{ t('dashboard.temporalEvolution') }}</h2>
          <div class="control-buttons">
            <button v-for="period in timePeriods" :key="period.value"
              @click="selectedPeriod = period.value; loadRealData()"
              :class="{ active: selectedPeriod === period.value }" class="period-btn">
              {{ t(`dashboard.periods.${period.value}`) }}
            </button>
          </div>
        </div>

        <div class="charts-grid">
          <div class="chart-item">
            <h3>{{ t('dashboard.newCasesPerDay') }}</h3>
            <canvas ref="casesChart" width="400" height="200"></canvas>
          </div>
          <div class="chart-item">
            <h3>{{ t('dashboard.mortalityTitle') }}</h3>
            <canvas ref="mortalityChart" width="400" height="200"></canvas>
          </div>
        </div>
      </section>

      <!-- Insights statistiques -->
      <section class="insights-section">
        <div class="insight-card primary">
          <div class="insight-icon">📊</div>
          <div class="insight-content">
            <h3>{{ t('dashboard.mostAffectedRegion') }}</h3>
            <p class="insight-value">{{ topRegion.name }}</p>
            <p class="insight-detail">{{ topRegion.percentage }}% {{ t('dashboard.totalCases') }}</p>
          </div>
        </div>

        <div class="insight-card secondary">
          <div class="insight-icon">📈</div>
          <div class="insight-content">
            <h3>{{ t('dashboard.weeklyTrend') }}</h3>
            <p class="insight-value">{{ weeklyTrend.value }}%</p>
            <p class="insight-detail">{{ weeklyTrend.direction }} {{ t('dashboard.lastWeek') }}</p>
          </div>
        </div>

        <div class="insight-card success">
          <div class="insight-icon">🎯</div>
          <div class="insight-content">
            <h3>{{ t('dashboard.totalCountriesTracked') }}</h3>
            <p class="insight-value">{{ totalCountries }}</p>
            <p class="insight-detail">{{ t('dashboard.countriesWithData') }}</p>
          </div>
        </div>
      </section>

      <!-- Collections de données -->
      <section class="data-section">
        <h2>{{ t('dashboard.dataCollections') }}</h2>
        <div v-if="collections.length > 0" class="collections-grid">
          <div v-for="collection in collections" :key="collection.collection" class="collection-item">
            <h4>{{ collection.collection }}</h4>
            <p>{{ collection.count.toLocaleString() }} {{ t('dashboard.documents') }}</p>
          </div>
        </div>
        <div v-else class="no-data">
          <p>{{ t('dashboard.noDataCollections') }}</p>
          <router-link to="/etl" class="btn btn-primary">{{ t('dashboard.loadData') }}</router-link>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCollections } from '@/services/etlService'
import Chart from 'chart.js/auto'
import DashboardService from '@/services/dashboardService'

const { t } = useI18n()

// État réactif pour les données réelles
const collections = ref([])
const loading = ref(true)
const totalCountries = ref(0)
const allData = ref([])
const realData = ref([])

// Données KPI calculées à partir des données réelles
const kpiData = ref({
  infectionRate: 0,
  mortalityRate: 0,
  recoveryRate: 0,
  casesChange: 0,
  deathsChange: 0,
  totalCases: 0
})

// Insights calculés
const topRegion = computed(() => {
  if (realData.value.length === 0) return { name: t('dashboard.noCountryDetected'), percentage: 0 }

  // **LISTE COMPLÈTE D'EXCLUSION** - Continents, groupes et catégories statistiques
  const exclusions = new Set([
    // Continents
    'Africa', 'Asia', 'Europe', 'North America', 'South America',
    'Oceania', 'Antarctica', 'Americas',

    // Régions WHO/OMS
    'European Region', 'Africa Region', 'South-East Asia',
    'Western Pacific', 'Eastern Mediterranean',

    // Groupes économiques
    'European Union', 'European Union (27)',
    'High-income countries', 'Low-income countries',
    'Lower-middle-income countries', 'Upper-middle-income countries',

    // Catégories statistiques "World excl."
    'World', 'World excl. China', 'World excl. China and South Korea',
    'World excl. China, South Korea, Japan and Singapore',

    // Catégories régionales "excl."
    'Asia excl. China',

    // Autres
    'International', 'Unknown', 'Other'
  ])

  const countryStats = {}
  let totalCases = 0

  realData.value.forEach(item => {
    let country = item.country || 'Unknown'
    const cases = parseInt(item.new_cases || 0)

    // Nettoyer le nom du pays
    country = country.trim()

    // **EXCLURE les catégories non-pays**
    if (!exclusions.has(country) && country !== '' && cases >= 0) {
      countryStats[country] = (countryStats[country] || 0) + cases
      totalCases += cases
    }
  })

  // Trier par nombre de cas décroissant
  const sortedCountries = Object.entries(countryStats)
    .filter(([country, cases]) => cases > 0) // Exclure les pays à 0 cas
    .sort(([, a], [, b]) => b - a)

  // **PRENDRE LE PREMIER VRAI PAYS**
  if (sortedCountries.length === 0) {
    return { name: t('dashboard.noCountryDetected'), percentage: 0 }
  }

  const [topCountryName, topCountryCases] = sortedCountries[0]
  const percentage = totalCases > 0 ? ((topCountryCases / totalCases) * 100).toFixed(1) : 0

  return {
    name: String(topCountryName),
    percentage: percentage
  }
})

const weeklyTrend = computed(() => {
  const change = kpiData.value.casesChange || 0
  return {
    value: Math.abs(change).toFixed(1),
    direction: change > 0 ? t('dashboard.increase') : t('dashboard.decrease')
  }
})

const casesChangeClass = computed(() => ({
  positive: kpiData.value.casesChange < 0,
  negative: kpiData.value.casesChange > 0
}))

const deathsChangeClass = computed(() => ({
  positive: kpiData.value.deathsChange < 0,
  negative: kpiData.value.deathsChange > 0
}))

// Contrôles de période
const timePeriods = ref([
  { label: '7J', value: '7d' },
  { label: '30J', value: '30d' },
  { label: '3M', value: '3m' },
  { label: '1A', value: '1y' }
])

const selectedPeriod = ref('30d')

// Références des graphiques
const casesChart = ref(null)
const mortalityChart = ref(null)
const worldMap = ref(null)
let casesChartInstance = null
let mortalityChartInstance = null

// Fonction utilitaire pour obtenir le numéro de semaine
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

// Nouvelle fonction pour grouper les données par période
const groupByPeriod = (data, period) => {
  const grouped = {}

  data.forEach(item => {
    let key
    const date = new Date(item.date)

    if (period === 'week') {
      // Grouper par semaine
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      key = startOfWeek.toISOString().split('T')[0]
    } else if (period === 'month') {
      // Grouper par mois
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    }

    if (!grouped[key]) {
      grouped[key] = { date: key, cases: 0, deaths: 0 }
    }

    grouped[key].cases += item.cases
    grouped[key].deaths += item.deaths
  })

  return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date))
}

// Méthodes
const prepareCountryData = () => {
  const countryStats = {}
  const zeroCountries = new Set()

  realData.value.forEach(item => {
    const country = item.country || 'Unknown'
    const cases = parseInt(item.new_cases || 0)
    const deaths = parseInt(item.new_deaths || 0)

    if (!countryStats[country]) {
      countryStats[country] = { cases: 0, deaths: 0 }
    }

    countryStats[country].cases += cases
    countryStats[country].deaths += deaths

    // Traquer les pays à zéro
    if (cases === 0 && deaths === 0) {
      zeroCountries.add(country)
    }
  })

  return countryStats
}

const createWorldMap = async () => {
  if (!worldMap.value || realData.value.length === 0) return

  // Vérifier si Plotly est disponible
  if (typeof window.Plotly === 'undefined') {
    console.warn('Plotly non disponible - ajoutez le script CDN dans index.html')
    return
  }

  try {
    const countryData = prepareCountryData()

    const countries = Object.keys(countryData)
    const cases = countries.map(country => countryData[country].cases)

    // Calculer les percentiles pour une meilleure distribution des couleurs
    const sortedCases = [...cases].sort((a, b) => a - b)
    const p25 = sortedCases[Math.floor(sortedCases.length * 0.25)]
    const p50 = sortedCases[Math.floor(sortedCases.length * 0.5)]
    const p75 = sortedCases[Math.floor(sortedCases.length * 0.75)]
    const p90 = sortedCases[Math.floor(sortedCases.length * 0.9)]

    const data = [{
      type: 'choropleth',
      locationmode: 'country names',
      locations: countries,
      z: cases,
      text: countries.map(country =>
        `${country}<br>${t('dashboard.casesLabel')}: ${countryData[country].cases.toLocaleString()}<br>${t('dashboard.deathsLabel')}: ${countryData[country].deaths.toLocaleString()}`
      ),
      hovertemplate: '%{text}<extra></extra>',
      colorscale: [
        [0, '#e8f5e8'],
        [0.25, '#a5d6a7'],
        [0.5, '#66bb6a'],
        [0.75, '#ff9800'],
        [0.9, '#f44336'],
        [1, '#b71c1c']
      ],
      zmin: 0,
      zmax: p90, // Limiter à 90e percentile pour éviter les valeurs extrêmes
      colorbar: {
        title: t('dashboard.newCasesLabel'),
        titlefont: { size: 14 },
        thickness: 15
      }
    }]

    const layout = {
      title: {
        text: t('dashboard.globalDistribution'),
        font: { size: 16, color: '#1f2937' }
      },
      geo: {
        projection: { type: 'natural earth' },
        showframe: false,
        showcoastlines: true,
        bgcolor: 'rgba(0,0,0,0)'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#1f2937' },
      margin: { t: 50, b: 0, l: 0, r: 0 }
    }

    const config = {
      responsive: true,
      displayModeBar: false
    }

    await window.Plotly.newPlot(worldMap.value, data, layout, config)
  } catch (error) {
    console.error('Erreur création carte monde:', error)
  }
}

const loadRealData = async () => {
  try {
    loading.value = true

    // Ajuster la limite selon la période pour optimiser les performances
    let limitData
    switch (selectedPeriod.value) {
      case '7d': limitData = 1000; break
      case '30d': limitData = 3000; break
      case '3m': limitData = 8000; break
      case '1y': limitData = 15000; break
      default: limitData = 5000
    }

    // Utiliser le service pour récupérer les données réelles (FILTRÉES)
    let dataResult = await DashboardService.getCovidDataByPeriod(selectedPeriod.value, limitData)

    if (!dataResult || dataResult.length === 0) {
      dataResult = []
    }

    // **NOUVEAU : Si c'est la première fois ou 1y, récupérer TOUTES les données**
    if (allData.value.length === 0 || selectedPeriod.value === '1y') {
      try {
        const allDataResult = await DashboardService.getCovidDataByPeriod('1y', 20000)
        allData.value = allDataResult || []
      } catch (error) {
        console.warn('Erreur chargement données complètes:', error)
        // Fallback : utiliser les données actuelles comme toutes les données
        allData.value = dataResult
      }
    }

    // Assigner les données filtrées pour les graphiques
    realData.value = dataResult

    // Récupérer les collections
    try {
      const collectionsResult = await getCollections()
      collections.value = collectionsResult.collections || []
    } catch (error) {
      console.warn('Erreur récupération collections:', error)
      collections.value = []
    }

    // Calculer les KPI avec la séparation allData/realData
    calculateKPIs()
    updateCountryCount()

    // Attendre le rendu puis mettre à jour les graphiques
    await nextTick()
    updateCharts()
    createWorldMap()

  } catch (error) {
    console.error('Erreur chargement données:', error)
    realData.value = []
    // En cas d'erreur, s'assurer qu'on a au moins quelque chose dans allData
    if (allData.value.length === 0) {
      allData.value = []
    }
  } finally {
    loading.value = false
  }
}

const calculateKPIs = () => {
  if (!realData.value || realData.value.length === 0) {
    kpiData.value = {
      infectionRate: 0,
      mortalityRate: 0,
      recoveryRate: 0,
      casesChange: 0,
      deathsChange: 0,
      totalCases: 0
    }
    return
  }

  // **UTILISER TOUTES LES DONNÉES pour les taux FIXES (infection, mortalité, guérison)**
  const dataForFixedRates = allData.value.length > 0 ? allData.value : realData.value

  const latestDataByCountry = {}

  dataForFixedRates.forEach(item => {
    const country = item.country || 'Unknown'
    const dateStr = item.date || item.date_reported || item.Date_reported
    const date = new Date(dateStr)

    if (!latestDataByCountry[country] ||
      date > new Date(latestDataByCountry[country].date || latestDataByCountry[country].date_reported)) {
      latestDataByCountry[country] = item
    }
  })

  // Calculer les totaux cumulés réels (FIXES pour tous les taux)
  let totalCasesCumulative = 0
  let totalDeathsCumulative = 0
  let totalRecovered = 0

  Object.values(latestDataByCountry).forEach(item => {
    const cases = item.total_cases || item.cumulative_cases || 0
    const deaths = item.total_deaths || item.cumulative_deaths || 0
    const recovered = item.total_recovered || item.recovered || 0

    totalCasesCumulative += parseInt(cases)
    totalDeathsCumulative += parseInt(deaths)
    totalRecovered += parseInt(recovered)
  })

  // **UTILISER LES DONNÉES FILTRÉES pour les changements (cases et deaths)**
  let casesChange = 0
  let deathsChange = 0

  const sortedData = [...realData.value]
    .filter(item => {
      const dateStr = item.date || item.date_reported || item.Date_reported
      return dateStr && !isNaN(new Date(dateStr).getTime())
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || a.date_reported || a.Date_reported)
      const dateB = new Date(b.date || b.date_reported || b.Date_reported)
      return dateA - dateB
    })

  // Grouper par date (pour cases ET deaths)
  const dailyTotals = {}
  sortedData.forEach(item => {
    const date = item.date || item.date_reported || item.Date_reported
    const cases = parseInt(item.new_cases || 0)
    const deaths = parseInt(item.new_deaths || 0)

    if (!dailyTotals[date]) {
      dailyTotals[date] = { cases: 0, deaths: 0 }
    }
    dailyTotals[date].cases += cases
    dailyTotals[date].deaths += deaths
  })

  const dailyArray = Object.entries(dailyTotals)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // **CALCUL ADAPTATIF pour casesChange ET deathsChange**
  const calculateChange = (dataArray, field) => {
    switch (selectedPeriod.value) {
      case '7d':
        if (dataArray.length >= 4) {
          const recent = dataArray.slice(-2).reduce((sum, day) => sum + day[field], 0)
          const previous = dataArray.slice(-4, -2).reduce((sum, day) => sum + day[field], 0)
          if (previous > 0) return ((recent - previous) / previous * 100)
          else if (recent > 0) return 100
        } else if (dataArray.length >= 2) {
          const recent = dataArray[dataArray.length - 1][field]
          const previous = dataArray[dataArray.length - 2][field]
          if (previous > 0) return ((recent - previous) / previous * 100)
        }
        break

      case '30d':
        if (dataArray.length >= 10) {
          const recent = dataArray.slice(-5).reduce((sum, day) => sum + day[field], 0)
          const previous = dataArray.slice(-10, -5).reduce((sum, day) => sum + day[field], 0)
          if (previous > 0) return ((recent - previous) / previous * 100)
          else if (recent > 0) return 100
        } else if (dataArray.length >= 6) {
          const recent = dataArray.slice(-3).reduce((sum, day) => sum + day[field], 0)
          const previous = dataArray.slice(-6, -3).reduce((sum, day) => sum + day[field], 0)
          if (previous > 0) return ((recent - previous) / previous * 100)
        } else if (dataArray.length >= 4) {
          const recent = dataArray.slice(-2).reduce((sum, day) => sum + day[field], 0)
          const previous = dataArray.slice(-4, -2).reduce((sum, day) => sum + day[field], 0)
          if (previous > 0) return ((recent - previous) / previous * 100)
        }
        break

      case '3m':
      case '1y':
        if (dataArray.length >= 28) {
          const recent = dataArray.slice(-14).reduce((sum, day) => sum + day[field], 0)
          const previous = dataArray.slice(-28, -14).reduce((sum, day) => sum + day[field], 0)
          if (previous > 0) return ((recent - previous) / previous * 100)
        } else if (dataArray.length >= 14) {
          const recent = dataArray.slice(-7).reduce((sum, day) => sum + day[field], 0)
          const previous = dataArray.slice(-14, -7).reduce((sum, day) => sum + day[field], 0)
          if (previous > 0) return ((recent - previous) / previous * 100)
        }
        break
    }

    // Fallback : tendance globale
    if (dataArray.length > 0) {
      const firstHalf = dataArray.slice(0, Math.floor(dataArray.length / 2))
      const secondHalf = dataArray.slice(Math.floor(dataArray.length / 2))

      const firstHalfTotal = firstHalf.reduce((sum, day) => sum + day[field], 0)
      const secondHalfTotal = secondHalf.reduce((sum, day) => sum + day[field], 0)

      if (firstHalfTotal > 0) {
        return ((secondHalfTotal - firstHalfTotal) / firstHalfTotal * 100)
      }
    }

    return 0
  }

  casesChange = calculateChange(dailyArray, 'cases')
  deathsChange = calculateChange(dailyArray, 'deaths')

  const totalPopulation = 8000000000

  kpiData.value = {
    // **TAUX D'INFECTION FIXE** - % population mondiale infectée depuis le début
    infectionRate: totalCasesCumulative > 0 ?
      ((totalCasesCumulative / totalPopulation) * 100).toFixed(3) : 0,

    // **TAUX DE MORTALITÉ FIXE** - Case Fatality Rate (décès/cas × 100)
    mortalityRate: totalCasesCumulative > 0 ?
      ((totalDeathsCumulative / totalCasesCumulative) * 100).toFixed(2) : 0,

    // **TAUX DE GUÉRISON FIXE** - % de cas non-mortels
    recoveryRate: totalCasesCumulative > 0 ?
      totalRecovered > 0
        ? ((totalRecovered / totalCasesCumulative) * 100).toFixed(1)
        : (((totalCasesCumulative - totalDeathsCumulative) / totalCasesCumulative) * 100).toFixed(1)
      : 0,

    // **CHANGEMENTS ADAPTATIFS** selon période sélectionnée
    casesChange: isNaN(casesChange) ? 0 : parseFloat(casesChange.toFixed(1)),
    deathsChange: isNaN(deathsChange) ? 0 : parseFloat(deathsChange.toFixed(1)),

    // Total pour info
    totalCases: totalCasesCumulative
  }
}

const updateCountryCount = () => {
  const uniqueCountries = new Set(realData.value.map(item => item.country).filter(Boolean))
  totalCountries.value = uniqueCountries.size
}

const prepareLocalChartData = () => {
  if (realData.value.length === 0) {
    return { labels: [], casesData: [], mortalityRates: [] }
  }

  // Grouper par date pour éviter les doublons
  const groupedByDate = {}

  realData.value.forEach(item => {
    const date = item.date
    const cases = parseInt(item.new_cases || 0)
    const deaths = parseInt(item.new_deaths || 0)

    if (date) {
      if (!groupedByDate[date]) {
        groupedByDate[date] = { cases: 0, deaths: 0 }
      }
      groupedByDate[date].cases += cases
      groupedByDate[date].deaths += deaths
    }
  })

  // Convertir en array et trier par date
  let sortedData = Object.entries(groupedByDate)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // Adapter le nombre de points selon la période sélectionnée
  let maxPoints
  switch (selectedPeriod.value) {
    case '7d':
      maxPoints = 7  // 1 point par jour
      break
    case '30d':
      maxPoints = 30 // 1 point par jour
      break
    case '3m':
      maxPoints = 12 // 1 point par semaine (12 semaines)
      // Grouper par semaine pour 3 mois
      sortedData = groupByPeriod(sortedData, 'week')
      break
    case '1y':
      maxPoints = 12 // 1 point par mois
      // Grouper par mois pour 1 an
      sortedData = groupByPeriod(sortedData, 'month')
      break
    default:
      maxPoints = 30
  }

  // Prendre les derniers points selon la période
  const finalData = sortedData.slice(-maxPoints)

  const labels = finalData.map(item => {
    const date = new Date(item.date)
    // Format des labels selon la période
    switch (selectedPeriod.value) {
      case '7d':
      case '30d':
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
      case '3m':
        return `S${getWeekNumber(date)}`
      case '1y':
        return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
      default:
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }
  })

  const casesData = finalData.map(item => item.cases)

  const mortalityRates = finalData.map(item => {
    return item.cases > 0 ? parseFloat(((item.deaths / item.cases) * 100).toFixed(2)) : 0
  })

  return { labels, casesData, mortalityRates }
}

const updateCharts = () => {
  if (realData.value.length === 0) return

  const chartData = prepareLocalChartData()
  if (chartData.labels.length === 0) return

  createCasesChart(chartData.labels, chartData.casesData)
  createMortalityChart(chartData.labels, chartData.mortalityRates)
}

const createCasesChart = (labels, data) => {
  if (!casesChart.value) return

  if (casesChartInstance) {
    casesChartInstance.destroy()
  }

  casesChartInstance = new Chart(casesChart.value, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: t('dashboard.newCasesLabel'),
        data,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 8,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b', font: { size: 12 } }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: {
            color: '#64748b',
            font: { size: 12 },
            callback: (value) => value.toLocaleString()
          }
        }
      }
    }
  })
}

const createMortalityChart = (labels, data) => {
  if (!mortalityChart.value) return

  if (mortalityChartInstance) {
    mortalityChartInstance.destroy()
  }

  mortalityChartInstance = new Chart(mortalityChart.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: t('dashboard.mortalityRateLabel'),
        data,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#ef4444',
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context) => `${context.raw}%`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b', font: { size: 12 } }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: {
            color: '#64748b',
            font: { size: 12 },
            callback: (value) => `${value}%`
          }
        }
      }
    }
  })
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

// Initialisation
onMounted(async () => {
  await loadRealData()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.dashboard-header {
  margin-bottom: 3rem;
}

.dashboard-title {
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.kpi-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.kpi-icon {
  font-size: 3rem;
  padding: 1rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.kpi-label {
  display: block;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0;
}

.kpi-trend {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
}

.kpi-trend.positive {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.kpi-trend.negative {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.map-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.map-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.world-map-container {
  position: relative;
  height: 400px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
}

.world-map {
  width: 100%;
  height: 100%;
}

.charts-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-controls h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.control-buttons {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  background: transparent;
  border-radius: 8px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn.active,
.period-btn:hover {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.chart-item {
  background: #f9fafb;
  border-radius: 15px;
  padding: 1.5rem;
}

.chart-item h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.chart-item canvas {
  height: 200px !important;
}

.insights-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.insight-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border-left: 5px solid;
}

.insight-card:hover {
  transform: translateY(-3px);
}

.insight-card.primary {
  border-left-color: #667eea;
}

.insight-card.secondary {
  border-left-color: #f59e0b;
}

.insight-card.success {
  border-left-color: #10b981;
}

.insight-icon {
  font-size: 2.5rem;
}

.insight-content h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.insight-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
  margin: 0.5rem 0;
}

.insight-detail {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

.data-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.data-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.collection-item {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.collection-item h4 {
  margin: 0 0 0.5rem 0;
  color: #667eea;
}

.no-data {
  text-align: center;
  padding: 2rem;
}

.chart-data-table {
  margin-top: 3rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
}

.chart-data-table summary {
  cursor: pointer;
  font-weight: 600;
  padding: 1.5rem;
  background: #f3f4f6;
}

.chart-data-table table {
  width: 100%;
  border-collapse: collapse;
}

.chart-data-table th,
.chart-data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.chart-data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

@media (max-width: 1200px) {
  .insights-section {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-title {
    font-size: 2rem;
  }

  .kpi-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .chart-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .insights-section {
    grid-template-columns: 1fr;
  }
}
</style>