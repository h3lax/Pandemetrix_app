<template>
  <div class="ia-analysis-page">
    <h1>{{ t('analysis.title') }}</h1>

    <!-- Section 1 : Lancer des prédictions -->
    <section class="card">
      <h2>{{ t('analysis.runPredictions') }}</h2>

      <!-- État du modèle ML -->
      <div v-if="mlHealth" class="ml-status"
        :class="mlHealth.ready_for_predictions ? 'status-ready' : 'status-not-ready'">
        <span>{{ mlHealth.ready_for_predictions ? `✅ ${t('analysis.modelReady')}` : `⚠️ ${t('analysis.modelNotAvailable')}` }}</span>
        <span class="ml-version">{{ t('analysis.version') }}: {{ mlHealth.model_version }}</span>
      </div>

      <form @submit.prevent="runPrediction" v-if="mlHealth?.ready_for_predictions">
        <div class="form-row">
          <label for="country-select">{{ t('analysis.country') }} :</label>
          <select id="country-select" v-model="selectedCountry" required>
            <option disabled value="">{{ t('analysis.selectCountry') }}</option>
            <option v-for="country in supportedCountries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label for="prediction-date">{{ t('analysis.predictionDate') }} :</label>
          <input id="prediction-date" type="date" v-model="predictionDate" required :min="minDate" :max="maxDate"
            @input="validateDate" />
          <div v-if="dateError" class="error-message" role="alert">
            {{ dateError }}
          </div>
          <div class="help-text">
            📅 {{ t('analysis.validRange') }} : {{ minDate }} {{ t('analysis.to') }} {{ maxDate }}
          </div>
        </div>

        <div class="form-row">
          <label for="new-cases">{{ t('analysis.currentNewCases') }} :</label>
          <input id="new-cases" type="number" v-model.number="inputData.new_cases" min="0" required
            :placeholder="t('analysis.exampleCases')" />
        </div>

        <div class="form-row">
          <label for="people-vaccinated">{{ t('analysis.totalVaccinated') }} :</label>
          <input id="people-vaccinated" type="number" v-model.number="inputData.people_vaccinated" min="0" required
            :placeholder="t('analysis.exampleVaccinated')" />
        </div>

        <div class="form-row">
          <label for="new-tests">{{ t('analysis.newTests') }} :</label>
          <input id="new-tests" type="number" v-model.number="inputData.new_tests" min="0" required
            :placeholder="t('analysis.exampleTests')" />
        </div>

        <div class="form-row">
          <label for="hospital-occupancy">{{ t('analysis.hospitalOccupancy') }} :</label>
          <input id="hospital-occupancy" type="number" v-model.number="inputData.daily_occupancy_hosp" min="0" required
            :placeholder="t('analysis.exampleHospital')" />
        </div>

        <button type="submit" :disabled="loadingPrediction || !canPredict">
          <span v-if="loadingPrediction" class="spinner" aria-hidden="true"></span>
          {{ loadingPrediction ? t('analysis.predicting') : t('analysis.runPrediction') }}
        </button>
      </form>

      <!-- Message si modèle non disponible -->
      <div v-else class="model-unavailable">
        <p>{{ t('analysis.modelUnavailable') }}</p>
        <button @click="initializeML" :disabled="initializing">
          {{ initializing ? t('analysis.initializing') : t('analysis.createAndTrain') }}
        </button>
      </div>

      <!-- Résultat de prédiction -->
      <div v-if="predictionResult" class="prediction-result">
        <h3>{{ t('analysis.predictionResult') }}</h3>
        <div class="prediction-main">
          <div class="prediction-value">
            <span class="label">{{ t('analysis.predictedDeaths') }} :</span>
            <span class="value">{{ predictionResult.prediction.new_deaths_rounded }}</span>
            <span class="value-precise">({{ predictionResult.prediction.new_deaths_predicted }})</span>
          </div>
          <div class="prediction-confidence">
            <span class="label">{{ t('analysis.confidence') }} :</span>
            <span>{{ predictionResult.prediction.confidence }}</span>
          </div>
        </div>

        <div v-if="predictionResult && predictionResult.model_info" class="prediction-meta">
          <span>{{ t('analysis.model') }} : {{ predictionResult.model_info.version }}</span>
          <span>{{ t('analysis.r2Score') }} : {{ predictionResult.model_info.r2_score }}</span>
          <span>{{ t('analysis.mae') }} : {{ predictionResult.model_info.mae }}</span>
          <span>{{ t('analysis.date') }} : {{ formatDate(predictionResult.timestamp) }}</span>
        </div>

        <!-- Données d'entrée utilisées -->
        <details class="input-summary">
          <summary>{{ t('analysis.inputDataUsed') }}</summary>
          <div class="input-data">
            <div>{{ t('analysis.country') }} : {{ predictionResult.prediction.country }}</div>
            <div>{{ t('analysis.date') }} : {{ predictionResult.prediction.date }}</div>
            <div>{{ t('analysis.currentNewCases') }} : {{ predictionResult.input_data.new_cases.toLocaleString() }}</div>
            <div>{{ t('analysis.totalVaccinated') }} : {{ predictionResult.input_data.people_vaccinated.toLocaleString() }}</div>
            <div>{{ t('analysis.newTests') }} : {{ predictionResult.input_data.new_tests.toLocaleString() }}</div>
            <div>{{ t('analysis.hospitalOccupancy') }} : {{ predictionResult.input_data.daily_occupancy_hosp.toLocaleString() }}</div>
          </div>
        </details>
      </div>

      <!-- Graphique de prédiction -->
      <div v-if="showChart" class="chart-container" style="margin-top:2em;">
        <h4>{{ t('analysis.predictiveTrendTitle') }}</h4>
        <canvas ref="chartCanvas" :aria-label="t('analysis.trendChart')" role="img"></canvas>
        <div id="chart-description" class="sr-only">
          {{ t('analysis.trendDescription') }} {{ selectedCountry }}
        </div>
      </div>
    </section>

    <!-- Section 2 : Informations du modèle -->
    <section class="card" v-if="modelInfo">
      <h2>{{ t('analysis.modelInfo') }}</h2>
      <div class="model-info-grid">
        <div class="info-item">
          <span class="label">{{ t('analysis.algorithm') }} :</span>
          <span>{{ modelInfo.algorithm }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ t('analysis.trainingDate') }} :</span>
          <span>{{ formatDate(modelInfo.training_date) }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ t('analysis.supportedCountries') }} :</span>
          <span>{{ modelInfo.countries_count }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ t('analysis.featuresUsed') }} :</span>
          <span>{{ (modelInfo.features_used && Array.isArray(modelInfo.features_used)) ?
            modelInfo.features_used.join(',') : t('analysis.notAvailable') }}</span>
        </div>
      </div>

      <!-- Performance du modèle -->
      <div class="model-performance">
        <h4>{{ t('analysis.modelPerformance') }}</h4>
        <div class="performance-metrics">
          <div class="metric">
            <span class="metric-label">{{ t('analysis.r2Score') }} :</span>
            <span class="metric-value">{{ modelInfo.performance?.test_r2?.toFixed(3) || 'N/A' }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">{{ t('analysis.mae') }} :</span>
            <span class="metric-value">{{ modelInfo.performance?.test_mae?.toFixed(2) || 'N/A' }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">{{ t('analysis.improvementVsBaseline') }} :</span>
            <span class="metric-value">+{{ modelInfo.performance?.improvement_r2_percent?.toFixed(1) || 'N/A' }}%</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import MLService from '@/services/mlService'
import Chart from 'chart.js/auto'

const { t } = useI18n()

// État réactif
const mlHealth = ref(null)
const supportedCountries = ref([])
const modelInfo = ref(null)
const selectedCountry = ref('')
const predictionDate = ref('')
const loadingPrediction = ref(false)
const loadingBatch = ref(false)
const initializing = ref(false)
const predictionResult = ref(null)
const batchResults = ref(null)
const showChart = ref(false)
const batchChart = ref(false)
const dateError = ref('')

const validateDate = () => {
  const date = predictionDate.value
  if (date < minDate.value || date > maxDate.value) {
    dateError.value = t('analysis.dateMustBeBetween', { min: minDate.value, max: maxDate.value })
  } else {
    dateError.value = ''
  }
}

// Données d'entrée
const inputData = ref({
  new_cases: 15000,
  people_vaccinated: 45000000,
  new_tests: 200000,
  daily_occupancy_hosp: 15000
})

// Références DOM
const chartCanvas = ref(null)
const batchChartCanvas = ref(null)
let chartInstance = null
let batchChartInstance = null

// Calculs
const canPredict = computed(() => {
  return selectedCountry.value &&
    predictionDate.value &&
    predictionDate.value >= minDate.value &&
    predictionDate.value <= maxDate.value &&
    inputData.value.new_cases >= 0 &&
    inputData.value.people_vaccinated >= 0 &&
    inputData.value.new_tests >= 0 &&
    inputData.value.daily_occupancy_hosp >= 0
})

const minDate = computed(() => {
  return '2020-12-02'
})

const maxDate = computed(() => {
  return '2022-06-22'
})

// Méthodes
const initializeML = async () => {
  initializing.value = true
  try {
    await MLService.trainModel()
    await loadMLComponents()
    announceToScreenReader(t('analysis.modelSuccessInit'))
  } catch (error) {
    console.error('Erreur initialisation ML:', error)
    announceToScreenReader(t('analysis.modelInitError'))
  } finally {
    initializing.value = false
  }
}

const loadMLComponents = async () => {
  try {
    const [healthData, countriesData, modelData] = await Promise.all([
      MLService.checkMLHealth(),
      MLService.getSupportedCountries().catch(() => ({ countries: [] })),
      MLService.getModelInfo().catch(() => null)
    ])

    mlHealth.value = healthData
    supportedCountries.value = countriesData.countries || []
    modelInfo.value = modelData

    if (supportedCountries.value.includes('France')) {
      selectedCountry.value = 'France'
    }

    // Date par défaut dans la plage valide
    predictionDate.value = '2022-05-15'

  } catch (error) {
    console.error('Erreur chargement composants ML:', error)
  }
}

const runPrediction = async () => {
  if (!canPredict.value) return

  loadingPrediction.value = true
  try {
    // Construire directement 7 prédictions (J+0 à J+6)
    const predictions = []
    const baseDate = new Date(predictionDate.value)
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(baseDate)
      currentDate.setDate(currentDate.getDate() + i)
      
      predictions.push({
        country: selectedCountry.value,
        date: currentDate.toISOString().split('T')[0],
        new_cases: inputData.value.new_cases,
        people_vaccinated: inputData.value.people_vaccinated,
        new_tests: inputData.value.new_tests,
        daily_occupancy_hosp: inputData.value.daily_occupancy_hosp
      })
    }

    // Valider la première prédiction
    MLService.validatePredictionData(predictions[0])

    // Envoyer le tableau directement à predictBatch
    const result = await MLService.predictBatch(predictions)
    
    // Adapter la structure pour le template
    const firstResult = result.results[0]
    predictionResult.value = {
      prediction: {
        new_deaths_rounded: Math.round(firstResult.new_deaths_predicted),
        new_deaths_predicted: firstResult.new_deaths_predicted,
        confidence: t('analysis.high'),
        country: firstResult.country,
        date: firstResult.date
      },
      input_data: predictions[0],
      model_info: {
        version: result.model_version,
        r2_score: modelInfo.value?.performance?.test_r2,
        mae: modelInfo.value?.performance?.test_mae
      },
      timestamp: result.timestamp,
      weekResults: result.results // Les 7 résultats pour le graphique
    }
    
    showChart.value = true
    await nextTick()
    renderPredictionChart()

    announceToScreenReader(`${t('analysis.predictionSuccess')}: ${firstResult.new_deaths_predicted} ${t('analysis.deathsPredicted')}`)
  } catch (error) {
    console.error('Erreur prédiction:', error)
    announceToScreenReader(t('analysis.predictionError'))
    alert(`${t('analysis.predictionError')}: ${error.message}`)
  } finally {
    loadingPrediction.value = false
  }
}

const renderPredictionChart = () => {
  if (chartInstance) chartInstance.destroy()

  // Utiliser les vraies prédictions au lieu de données simulées
  const days = [
    t('analysis.today'), 
    t('analysis.day1'), 
    t('analysis.day2'), 
    t('analysis.day3'), 
    t('analysis.day4'), 
    t('analysis.day5'), 
    t('analysis.day6')
  ]
  const trendData = predictionResult.value.weekResults?.map(r => r.new_deaths_predicted) ||
    [predictionResult.value.prediction.new_deaths_predicted] // fallback

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        label: t('analysis.predictedDeaths'),
        data: trendData,
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        pointBackgroundColor: '#dc2626',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { 
          display: true, 
          text: `${t('analysis.predictiveTrendTitle')} - ${selectedCountry.value}` 
        }
      },
      scales: {
        y: { 
          beginAtZero: true, 
          title: { 
            display: true, 
            text: t('analysis.deathsCount') 
          } 
        }
      }
    }
  })
}

const renderBatchChart = (results) => {
  if (batchChartInstance) batchChartInstance.destroy()

  const labels = results.map(r => new Date(r.date).toLocaleDateString('fr'))
  const data = results.map(r => r.new_deaths_predicted)

  batchChartInstance = new Chart(batchChartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: t('analysis.dailyPredictedDeaths'),
        data,
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: '#dc2626',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { 
          display: true, 
          text: `${t('analysis.predictions7Days')} - ${selectedCountry.value}` 
        }
      },
      scales: {
        y: { 
          beginAtZero: true, 
          title: { 
            display: true, 
            text: t('analysis.predictedDeaths') 
          } 
        }
      }
    }
  })
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('fr-FR')
}

const announceToScreenReader = (message) => {
  const announcer = document.getElementById('announcements')
  if (announcer) {
    announcer.textContent = message
    setTimeout(() => { announcer.textContent = '' }, 1000)
  }
}

// Initialisation
onMounted(async () => {
  await loadMLComponents()
})
</script>

<style scoped>
.ia-analysis-page {
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 2em 1em;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: linear-gradient(120deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

@media (min-width: 1024px) {
  .ia-analysis-page {
    padding: 2em 4em;
  }
}

.ia-analysis-page h1 {
  text-align: center;
  color: var(--color-bg-primary);
  font-size: 2.4em;
  margin-bottom: 1.5em;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.card {
  background: var(--color-bg-primary);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(21, 101, 192, 0.15);
  padding: 2em;
  margin-bottom: 2em;
  border-left: 7px solid var(--color-primary);
}

.card h2 {
  color: var(--color-primary);
  font-size: 1.35em;
  margin-bottom: 1em;
  font-weight: bold;
}

.ml-status {
  padding: 1em;
  border-radius: 8px;
  margin-bottom: 1.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-ready {
  background: #eafaf1;
  border: 2px solid var(--color-success);
  color: var(--color-success);
}

.status-not-ready {
  background: #fef2f2;
  border: 2px solid var(--color-warning);
  color: var(--color-warning);
}

.ml-version {
  font-size: 0.9em;
  opacity: 0.8;
}

.form-row {
  margin-bottom: 1.5rem;
}

.form-row label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
}

.form-row input,
.form-row select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
}

.form-row input:focus,
.form-row select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.2);
}

button {
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-bg-primary);
  border: none;
  border-radius: 6px;
  padding: 0.75em 1.5em;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
}

button:disabled {
  background: var(--color-text-disabled);
  cursor: not-allowed;
}

.model-unavailable {
  text-align: center;
  padding: 2em;
  background: #fef2f2;
  border-radius: 8px;
  border: 2px solid var(--color-warning);
}

.prediction-result {
  background: linear-gradient(90deg, #eafaf1 0%, #f0f9ff 100%);
  border: 2px solid var(--color-success);
  border-radius: 12px;
  padding: 1.5em;
  margin-top: 2em;
}

.prediction-main {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2em;
  margin-bottom: 1em;
}

.prediction-value {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.prediction-value .label {
  font-size: 0.9em;
  color: var(--color-text-secondary);
}

.prediction-value .value {
  font-size: 2.5em;
  font-weight: bold;
  color: var(--color-error);
}

.prediction-value .value-precise {
  font-size: 1em;
  color: var(--color-text-secondary);
}

.prediction-confidence {
  text-align: right;
}

.prediction-meta {
  display: flex;
  gap: 1.5em;
  flex-wrap: wrap;
  font-size: 0.9em;
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-border);
  padding-top: 1em;
}

.input-summary {
  margin-top: 1em;
}

.input-data {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5em;
  margin-top: 0.5em;
  font-size: 0.9em;
}

.model-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1em;
  margin-bottom: 1.5em;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.info-item .label {
  font-size: 0.9em;
  color: var(--color-text-secondary);
}

.model-performance {
  background: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 1.5em;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1em;
}

.metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 0.9em;
  color: var(--color-text-secondary);
  margin-bottom: 0.25em;
}

.metric-value {
  font-size: 1.5em;
  font-weight: bold;
  color: var(--color-primary);
}

.batch-controls {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 1.5em;
}

.chart-container {
  background: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 1.5em;
}

.chart-container h4 {
  margin-bottom: 1em;
  color: var(--color-text-primary);
}

.chart-container canvas {
  max-height: 400px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-bg-primary);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .prediction-main {
    grid-template-columns: 1fr;
  }

  .prediction-meta {
    flex-direction: column;
    gap: 0.5em;
  }

  .model-info-grid {
    grid-template-columns: 1fr;
  }

  .performance-metrics {
    grid-template-columns: 1fr;
  }

  .batch-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>