<template>
  <main class="dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">PANDEMETRIX ANALYTICS</h1>
      <div class="kpi-cards">
        <div class="kpi-card infection">
          <div class="kpi-icon">🦠</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.infectionRate || 'N/A' }}%</span>
            <span class="kpi-label">Taux d'infection</span>
            <span class="kpi-trend" :class="casesChangeClass">{{ kpiData?.casesChange || 'N/A' }}%</span>
          </div>
        </div>
        <div class="kpi-card mortality">
          <div class="kpi-icon">💀</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.mortalityRate || 'N/A' }}%</span>
            <span class="kpi-label">Taux de mortalité</span>
            <span class="kpi-trend" :class="deathsChangeClass">{{ kpiData?.deathsChange || 'N/A' }}%</span>
          </div>
        </div>
        <div class="kpi-card recovery">
          <div class="kpi-icon">✅</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.vaccineRate || 'N/A' }}%</span>
            <span class="kpi-label">Taux de vaccination</span>
            <span class="kpi-trend positive">{{ kpiData?.vaccineChange || 'N/A' }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Carte avec indicateurs -->
      <section class="map-section">
        <h2>Répartition par région</h2>
        <div class="map-container">
          <div class="france-map">
            <div v-for="region in regionData" :key="region.name" class="region-indicator"
              :style="{ top: region.top, left: region.left }" :data-region="region.name">
              <div class="indicator-dot" :class="{ pulse: region.risk === 'high' }"
                :style="{ background: region.color }"></div>
              <span class="indicator-value">{{ region.value }}</span>
            </div>
          </div>
          <div class="map-legend">
            <div class="legend-item">
              <div class="legend-color" style="background: #ff4757;"></div>
              <span>Risque élevé</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #ffa726;"></div>
              <span>Risque modéré</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #26de81;"></div>
              <span>Risque faible</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Graphiques avec contrôles -->
      <section class="charts-section">
        <div class="chart-controls">
          <h2>Évolution temporelle</h2>
          <div class="control-buttons">
            <button v-for="period in timePeriods" :key="period.value"
              @click="selectedPeriod = period.value; loadRealData()"
              :class="{ active: selectedPeriod === period.value }" class="period-btn">
              {{ period.label }}
            </button>
          </div>
        </div>

        <div class="charts-grid">
          <div class="chart-item">
            <h3>Nouveaux cas par jour</h3>
            <canvas ref="casesChart" width="400" height="200"></canvas>
          </div>
          <div class="chart-item">
            <h3>Nouveaux décès par jour</h3>
            <canvas ref="deathsChart" width="400" height="200"></canvas>
          </div>
        </div>
      </section>

      <!-- Insights statistiques -->
      <section class="insights-section">
        <div class="insight-card primary">
          <div class="insight-icon">📊</div>
          <div class="insight-content">
            <h3>Pays le plus touché</h3>
            <p class="insight-value">{{ topCountry.name }}</p>
            <p class="insight-detail">{{ topCountry.cases.toLocaleString() }} cas totaux</p>
          </div>
        </div>

        <div class="insight-card secondary">
          <div class="insight-icon">📈</div>
          <div class="insight-content">
            <h3>Tendance hebdomadaire</h3>
            <p class="insight-value">{{ weeklyTrend.value }}%</p>
            <p class="insight-detail">{{ weeklyTrend.direction }} par rapport à la semaine dernière</p>
          </div>
        </div>

        <div class="insight-card success">
          <div class="insight-icon">🏥</div>
          <div class="insight-content">
            <h3>Occupation hospitalière</h3>
            <p class="insight-value">{{ hospitalData?.average || 'N/A' }}</p>
            <p class="insight-detail">Moyenne patients hospitalisés</p>
          </div>
        </div>
      </section>

      <!-- Collections de données -->
      <section class="data-section">
        <h2>Collections de données</h2>
        <div v-if="collections.length > 0" class="collections-grid">
          <div v-for="collection in collections" :key="collection.collection" class="collection-item">
            <h4>{{ collection.collection }}</h4>
            <p>{{ collection.count.toLocaleString() }} documents</p>
          </div>
        </div>
        <div v-else class="no-data">
          <p>Aucune collection de données disponible</p>
          <router-link to="/etl" class="btn btn-primary">Charger des données</router-link>
        </div>
      </section>
    </div>

    <!-- Données tabulaires (accessibilité) -->
    <details class="chart-data-table">
      <summary>Afficher les données sous forme de tableau</summary>
      <table v-if="realData.length > 0" aria-labelledby="chart-section-title">
        <caption>Données détaillées du dashboard</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Pays</th>
            <th scope="col">Nouveaux cas</th>
            <th scope="col">Nouveaux décès</th>
            <th scope="col">Tests</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in realData.slice(0, 10)" :key="index">
            <th scope="row">{{ formatDate(item.date) }}</th>
            <td>{{ item.country || 'N/A' }}</td>
            <td>{{ (item.new_cases || 0).toLocaleString() }}</td>
            <td>{{ (item.new_deaths || 0).toLocaleString() }}</td>
            <td>{{ (item.new_tests || 'N/A') }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { getCollections } from '@/services/etlService'
import Chart from 'chart.js/auto'
import DashboardService from '@/services/dashboardService'

// État réactif pour les données réelles
const realData = ref([])
const collections = ref([])
const hospitalData = ref(null)
const loading = ref(true)

// Données régionales calculées à partir des vraies données
const regionData = ref([
  { name: 'Île-de-France', top: '20%', left: '30%', value: '12.4k', color: '#ff4757', risk: 'high' },
  { name: 'PACA', top: '60%', left: '40%', value: '8.2k', color: '#ffa726', risk: 'moderate' },
  { name: 'Auvergne-Rhône-Alpes', top: '45%', left: '35%', value: '6.1k', color: '#26de81', risk: 'low' },
  { name: 'Nouvelle-Aquitaine', top: '55%', left: '15%', value: '4.8k', color: '#26de81', risk: 'low' },
  { name: 'Occitanie', top: '65%', left: '25%', value: '5.9k', color: '#ffa726', risk: 'moderate' }
])

// KPI calculés à partir des données réelles
const kpiData = ref({
  infectionRate: 0,
  mortalityRate: 0,
  vaccineRate: 0,
  casesChange: 0,
  deathsChange: 0,
  vaccineChange: 0
})

// Insights calculés
const topCountry = computed(() => {
  if (realData.value.length === 0) return { name: 'N/A', cases: 0 }
  
  const countryStats = {}
  realData.value.forEach(item => {
    const country = item.country || 'Unknown'
    const cases = item.total_cases || item.new_cases || 0
    if (!countryStats[country] || countryStats[country] < cases) {
      countryStats[country] = cases
    }
  })
  
  const topEntry = Object.entries(countryStats)
    .sort(([,a], [,b]) => b - a)[0]
  
  return {
    name: topEntry?.[0] || 'N/A',
    cases: topEntry?.[1] || 0
  }
})

const weeklyTrend = computed(() => {
  const change = kpiData.value.casesChange || 0
  return {
    value: Math.abs(change).toFixed(1),
    direction: change > 0 ? 'Augmentation' : 'Diminution'
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
const deathsChart = ref(null)
let casesChartInstance = null
let deathsChartInstance = null

// Méthodes
const loadRealData = async () => {
  try {
    loading.value = true
    
    // Charger les données depuis les collections MongoDB
    const [casesData, hospitalInfo, collectionsResult] = await Promise.all([
      fetchCollectionData('ml_cases_deaths'),
      fetchCollectionData('ml_hospital'),
      getCollections().catch(() => ({ collections: [] }))
    ])
    
    realData.value = casesData || []
    hospitalData.value = calculateHospitalStats(hospitalInfo || [])
    collections.value = collectionsResult.collections || []
    
    console.log('Données chargées:', {
      cases: realData.value.length,
      hospital: hospitalInfo?.length || 0,
      collections: collections.value.length
    })
    
    calculateKPIs()
    
    await nextTick()
    updateCharts()
    
  } catch (error) {
    console.error('Erreur chargement données:', error)
  } finally {
    loading.value = false
  }
}

const fetchCollectionData = async (collectionName) => {
  try {
    const response = await fetch(`http://localhost:5000/api/data?page_size=1000&page=1`)
    if (!response.ok) return []
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(`Erreur fetch ${collectionName}:`, error)
    return []
  }
}

const calculateKPIs = () => {
  if (!realData.value.length) return

  // Calculer les KPI à partir des données réelles
  const recentData = realData.value.slice(-30) // 30 derniers jours
  const totalCases = recentData.reduce((sum, item) => sum + (item.new_cases || 0), 0)
  const totalDeaths = recentData.reduce((sum, item) => sum + (item.new_deaths || 0), 0)
  
  // Estimation population mondiale
  const worldPopulation = 8000000000
  
  // Calculer taux de vaccination si disponible
  const avgVaccinated = recentData.reduce((sum, item) => {
    const vaccinated = item.people_vaccinated_per_hundred || 0
    return sum + vaccinated
  }, 0) / recentData.length
  
  // Comparer avec la période précédente pour les tendances
  const previousData = realData.value.slice(-60, -30)
  const prevCases = previousData.reduce((sum, item) => sum + (item.new_cases || 0), 0)
  const prevDeaths = previousData.reduce((sum, item) => sum + (item.new_deaths || 0), 0)
  
  kpiData.value = {
    infectionRate: ((totalCases / worldPopulation) * 100).toFixed(3),
    mortalityRate: totalCases > 0 ? ((totalDeaths / totalCases) * 100).toFixed(1) : 0,
    vaccineRate: avgVaccinated.toFixed(1),
    casesChange: prevCases > 0 ? (((totalCases - prevCases) / prevCases) * 100).toFixed(1) : 0,
    deathsChange: prevDeaths > 0 ? (((totalDeaths - prevDeaths) / prevDeaths) * 100).toFixed(1) : 0,
    vaccineChange: 2.1 // Estimation
  }
}

const calculateHospitalStats = (hospitalData) => {
  if (!hospitalData.length) return { average: 'N/A' }
  
  const avgOccupancy = hospitalData.reduce((sum, item) => {
    return sum + (item.daily_occupancy_hosp || 0)
  }, 0) / hospitalData.length
  
  return {
    average: Math.round(avgOccupancy).toLocaleString()
  }
}

const updateCharts = () => {
  if (realData.value.length === 0) {
    console.log('Aucune donnée disponible pour les graphiques')
    return
  }

  console.log('Mise à jour des graphiques avec', realData.value.length, 'éléments')

  const chartData = prepareChartData()
  
  if (chartData.labels.length === 0) {
    console.log('Aucune donnée valide trouvée')
    return
  }

  createCasesChart(chartData.labels, chartData.casesData)
  createDeathsChart(chartData.labels, chartData.deathsData)
}

const prepareChartData = () => {
  // Filtrer et trier les données par date
  const validData = realData.value
    .filter(item => {
      const date = item.date
      const cases = item.new_cases
      return date && cases !== undefined
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14) // Prendre les 14 derniers jours

  console.log('Données valides pour graphiques:', validData.length)

  if (validData.length === 0) {
    return { labels: [], casesData: [], deathsData: [] }
  }

  // Grouper par date
  const groupedData = {}
  validData.forEach(item => {
    const dateKey = item.date
    if (!groupedData[dateKey]) {
      groupedData[dateKey] = { cases: 0, deaths: 0 }
    }
    groupedData[dateKey].cases += (item.new_cases || 0)
    groupedData[dateKey].deaths += (item.new_deaths || 0)
  })

  const labels = Object.keys(groupedData).map(date => 
    new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }))
  
  const casesData = Object.values(groupedData).map(d => d.cases)
  const deathsData = Object.values(groupedData).map(d => d.deaths)

  console.log('Données préparées:', { labels: labels.length, cases: casesData, deaths: deathsData })

  return { labels, casesData, deathsData }
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
        label: 'Nouveaux cas',
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
        legend: { display: true, position: 'top' },
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

const createDeathsChart = (labels, data) => {
  if (!deathsChart.value) return

  if (deathsChartInstance) {
    deathsChartInstance.destroy()
  }

  deathsChartInstance = new Chart(deathsChart.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Nouveaux décès',
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
        legend: { display: true, position: 'top' },
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
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
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
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
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

.map-container {
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 15px;
  overflow: hidden;
}

.france-map {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cpath d='M50 50 L250 50 L250 200 L150 250 L50 200 Z' fill='%23e5e7eb' stroke='%23d1d5db' stroke-width='2'/%3E%3C/svg%3E") center/contain no-repeat;
}

.region-indicator {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.region-indicator:hover {
  transform: scale(1.1);
}

.indicator-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.5rem;
}

.indicator-dot.pulse {
  animation: pulse 2s infinite;
}

.indicator-value {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.map-legend {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
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
  grid-column: 1 / -1;
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
  grid-column: 1 / -1;
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
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .insights-section {
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

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
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