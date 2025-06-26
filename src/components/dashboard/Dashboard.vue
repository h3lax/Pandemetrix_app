<template>
  <main class="dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">PANDEMETRIX ANALYTICS</h1>
      <div class="kpi-cards">
        <div class="kpi-card infection">
          <div class="kpi-icon">🦠</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.totalCases || 0 }}</span>
            <span class="kpi-label">Cas totaux</span>
            <span class="kpi-trend" :class="casesChangeClass">{{ kpiData?.casesChange || 0 }}%</span>
          </div>
        </div>
        <div class="kpi-card mortality">
          <div class="kpi-icon">💀</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.totalDeaths || 0 }}</span>
            <span class="kpi-label">Décès totaux</span>
            <span class="kpi-trend" :class="deathsChangeClass">{{ kpiData?.deathsChange || 0 }}%</span>
          </div>
        </div>
        <div class="kpi-card recovery">
          <div class="kpi-icon">⚕️</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ modelPerformance?.r2Score || 'N/A' }}</span>
            <span class="kpi-label">Précision du modèle (R²)</span>
            <span class="kpi-trend positive">{{ modelPerformance?.mae || 'N/A' }} MAE</span>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Section modèle ML -->
      <section class="model-section">
        <h2>État du modèle</h2>
        <div v-if="mlHealth" class="model-status">
          <div class="status-indicator" :class="mlHealth.ready_for_predictions ? 'ready' : 'not-ready'">
            {{ mlHealth.ready_for_predictions ? '✅ Modèle actif' : '⚠️ Modèle inactif' }}
          </div>
          <div class="model-details">
            <p><strong>Version:</strong> {{ modelInfo?.version || 'N/A' }}</p>
            <p><strong>Pays supportés:</strong> {{ supportedCountries?.length || 0 }}</p>
            <p><strong>Algorithme:</strong> {{ modelInfo?.algorithm || 'N/A' }}</p>
          </div>
        </div>

        <!-- Prédiction rapide -->
        <div v-if="mlHealth?.ready_for_predictions" class="quick-prediction">
          <h3>Prédiction rapide</h3>
          <div class="prediction-form">
            <select v-model="selectedCountry" @change="makePrediction">
              <option value="">Sélectionner un pays</option>
              <option v-for="country in supportedCountries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
            <div v-if="latestPrediction" class="prediction-result">
              <span class="prediction-label">Décès prédits:</span>
              <span class="prediction-value">{{ latestPrediction.new_deaths_rounded }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Graphiques avec données réelles -->
      <section class="charts-section">
        <div class="chart-controls">
          <h2>Données COVID-19</h2>
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
            <h3>Évolution des cas ({{ selectedPeriod }})</h3>
            <canvas ref="casesChart" width="400" height="200"></canvas>
          </div>
          <div class="chart-item">
            <h3>Évolution des décès ({{ selectedPeriod }})</h3>
            <canvas ref="deathsChart" width="400" height="200"></canvas>
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

    <!-- Données tabulaires -->
    <details class="chart-data-table">
      <summary>Afficher les données détaillées</summary>
      <table v-if="realData.length > 0" aria-labelledby="chart-section-title">
        <caption>Données COVID-19 récentes</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Pays</th>
            <th scope="col">Nouveaux cas</th>
            <th scope="col">Nouveaux décès</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in realData.slice(0, 10)" :key="index">
            <th scope="row">{{ formatDate(item.date_reported || item.date) }}</th>
            <td>{{ item.country || item.Country || 'N/A' }}</td>
            <td>{{ (item.new_cases || item.New_cases || 0).toLocaleString() }}</td>
            <td>{{ (item.new_deaths || item.New_deaths || 0).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { fetchData } from '@/services/dataServices'
import { getCollections } from '@/services/etlService'
import MLService from '@/services/mlService'
import Chart from 'chart.js/auto'
import DashboardService from '@/services/dashboardService'

// État réactif pour les données réelles
const realData = ref([])
const collections = ref([])
const mlHealth = ref(null)
const modelInfo = ref(null)
const supportedCountries = ref([])
const selectedCountry = ref('')
const latestPrediction = ref(null)
const loading = ref(true)

// KPI calculés à partir des données réelles
const kpiData = ref({
  totalCases: 0,
  totalDeaths: 0,
  casesChange: 0,
  deathsChange: 0
})

const modelPerformance = computed(() => {
  if (!modelInfo.value?.performance) return null
  return {
    r2Score: (modelInfo.value.performance.test_r2 * 100).toFixed(1) + '%',
    mae: modelInfo.value.performance.test_mae?.toFixed(1)
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

// Chargement des données ML
const loadMLData = async () => {
  try {
    const [healthData, countriesData, modelData] = await Promise.all([
      MLService.checkMLHealth().catch(() => ({ ready_for_predictions: false })),
      MLService.getSupportedCountries().catch(() => ({ countries: [] })),
      MLService.getModelInfo().catch(() => null)
    ])

    mlHealth.value = healthData
    supportedCountries.value = countriesData.countries || []
    modelInfo.value = modelData

    if (supportedCountries.value.length > 0) {
      selectedCountry.value = supportedCountries.value[0]
    }
  } catch (error) {
    console.error('Erreur chargement données ML:', error)
  }
}

// Chargement des données réelles
const loadRealData = async () => {
  try {
    loading.value = true

    // Charger les données depuis les collections MongoDB
    const [dataResult, collectionsResult] = await Promise.all([
      DashboardService.getCovidDataByPeriod(selectedPeriod.value),
      getCollections().catch(() => ({ collections: [] }))
    ])
    realData.value = dataResult
    collections.value = collectionsResult.collections || []

    // Calculer les KPI à partir des données réelles
    calculateKPIs()

    // Mettre à jour les graphiques
    await nextTick()
    updateCharts()

  } catch (error) {
    console.error('Erreur chargement données réelles:', error)
  } finally {
    loading.value = false
  }
}

// Calcul des KPI à partir des données réelles
const calculateKPIs = () => {
  kpiData.value = DashboardService.calculateKPIs(realData.value)
}

// Prédiction rapide
const makePrediction = async () => {
  if (!selectedCountry.value || !mlHealth.value?.ready_for_predictions) return

  try {
    const predictionData = {
      country: selectedCountry.value,
      date: new Date().toISOString().split('T')[0],
      new_cases: 1000,
      people_vaccinated: 50000000,
      new_tests: 100000,
      daily_occupancy_hosp: 2000
    }

    const result = await MLService.predict(predictionData)
    latestPrediction.value = result.prediction
  } catch (error) {
    console.error('Erreur prédiction:', error)
  }
}

// Mise à jour des graphiques avec données réelles
const updateCharts = () => {
  if (realData.value.length === 0) return

  const casesChartData = DashboardService.prepareChartData(realData.value, 'new_cases')
  const deathsChartData = DashboardService.prepareChartData(realData.value, 'new_deaths')

  createCasesChart(casesChartData.labels, casesChartData.data)
  createDeathsChart(deathsChartData.labels, deathsChartData.data)
}

const createCasesChart = (labels, data) => {
  if (casesChartInstance) casesChartInstance.destroy()

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
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: { callback: (value) => value.toLocaleString() }
        }
      }
    }
  })
}

const createDeathsChart = (labels, data) => {
  if (deathsChartInstance) deathsChartInstance.destroy()

  deathsChartInstance = new Chart(deathsChart.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Nouveaux décès',
        data,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#ef4444',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: { callback: (value) => value.toLocaleString() }
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
  await Promise.all([
    loadMLData(),
    loadRealData()
  ])
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
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto auto;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.model-section {
  grid-row: 1 / 3;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.model-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.model-status {
  margin-bottom: 2rem;
}

.status-indicator {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 600;
}

.status-indicator.ready {
  background: #eafaf1;
  color: var(--color-success);
  border: 2px solid var(--color-success);
}

.status-indicator.not-ready {
  background: #fef2f2;
  color: var(--color-warning);
  border: 2px solid var(--color-warning);
}

.model-details p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.quick-prediction {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.prediction-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.prediction-form select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
}

.prediction-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--color-primary);
}

.prediction-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-error);
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
  color: var(--color-primary);
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
  
  .model-section {
    grid-row: 1;
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

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>