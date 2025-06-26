<template>
  <main class="dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">PANDEMETRIX ANALYTICS</h1>
      <div class="kpi-cards">
        <div class="kpi-card infection">
          <div class="kpi-icon">🦠</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.infectionRate || 2.4 }}%</span>
            <span class="kpi-label">Taux d'infection</span>
            <span class="kpi-trend positive">{{ kpiData?.infectionChange || -0.8 }}%</span>
          </div>
        </div>
        <div class="kpi-card mortality">
          <div class="kpi-icon">💀</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.mortalityRate || 1.2 }}%</span>
            <span class="kpi-label">Taux de mortalité</span>
            <span class="kpi-trend positive">{{ kpiData?.mortalityChange || -0.3 }}%</span>
          </div>
        </div>
        <div class="kpi-card recovery">
          <div class="kpi-icon">✅</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ kpiData?.recoveryRate || 96.4 }}%</span>
            <span class="kpi-label">Taux de guérison</span>
            <span class="kpi-trend positive">{{ kpiData?.recoveryChange || 1.1 }}%</span>
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
            <div class="region-indicator" style="top: 30%; left: 20%;" data-region="Bretagne">
              <div class="indicator-dot" style="background: #ff6b6b;"></div>
              <span class="indicator-value">1.2k</span>
            </div>
            <div class="region-indicator" style="top: 40%; left: 50%;" data-region="Île-de-France">
              <div class="indicator-dot pulse" style="background: #ff4757;"></div>
              <span class="indicator-value">5.8k</span>
            </div>
            <div class="region-indicator" style="top: 60%; left: 70%;" data-region="PACA">
              <div class="indicator-dot" style="background: #ffa726;"></div>
              <span class="indicator-value">2.1k</span>
            </div>
            <div class="region-indicator" style="top: 20%; left: 80%;" data-region="Grand Est">
              <div class="indicator-dot" style="background: #26de81;"></div>
              <span class="indicator-value">0.8k</span>
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
            <button 
              v-for="period in timePeriods" 
              :key="period.value"
              @click="selectedPeriod = period.value; updateChartData()"
              :class="{ active: selectedPeriod === period.value }"
              class="period-btn"
            >
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
            <h3>Taux de mortalité</h3>
            <canvas ref="mortalityChart" width="400" height="200"></canvas>
          </div>
        </div>
      </section>

      <!-- Insights statistiques -->
      <section class="insights-section">
        <div class="insight-card primary">
          <div class="insight-icon">📊</div>
          <div class="insight-content">
            <h3>Région la plus touchée</h3>
            <p class="insight-value">Île-de-France</p>
            <p class="insight-detail">58.7% des cas nationaux pour 2025</p>
          </div>
        </div>

        <div class="insight-card secondary">
          <div class="insight-icon">📈</div>
          <div class="insight-content">
            <h3>Tendance hebdomadaire</h3>
            <p class="insight-value">+12.4%</p>
            <p class="insight-detail">Augmentation par rapport à la semaine dernière</p>
          </div>
        </div>

        <div class="insight-card success">
          <div class="insight-icon">🎯</div>
          <div class="insight-content">
            <h3>Efficacité vaccin</h3>
            <p class="insight-value">94.2%</p>
            <p class="insight-detail">Réduction des cas sévères</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Données tabulaires (accessibilité) -->
    <details class="chart-data-table">
      <summary>Afficher les données sous forme de tableau</summary>
      <table aria-labelledby="chart-section-title">
        <caption>Données détaillées du dashboard</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Nouveaux cas</th>
            <th scope="col">Décès</th>
            <th scope="col">Guérisons</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <th scope="row">{{ item.date }}</th>
            <td>{{ item.cases.toLocaleString() }}</td>
            <td>{{ item.deaths.toLocaleString() }}</td>
            <td>{{ item.recoveries.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </main>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { fetchData } from '@/services/dataServices'
import Chart from 'chart.js/auto'

// Données KPI
const kpiData = ref({
  infectionRate: 2.4,
  infectionChange: -0.8,
  infectionTrend: 'positive',
  mortalityRate: 1.2,
  mortalityChange: -0.3,
  mortalityTrend: 'positive',
  recoveryRate: 96.4,
  recoveryChange: 1.1,
  recoveryTrend: 'positive'
})

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
let casesChartInstance = null
let mortalityChartInstance = null

// Données pour les graphiques et tableau
const chartData = ref({
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
  cases: [1200, 1500, 1800, 1400, 1100, 900],
  mortality: [2.1, 1.8, 1.5, 1.2, 1.0, 0.8]
})

const tableData = ref([
  { date: '2025-06-20', cases: 1200, deaths: 24, recoveries: 1150 },
  { date: '2025-06-21', cases: 1100, deaths: 22, recoveries: 1070 },
  { date: '2025-06-22', cases: 950, deaths: 19, recoveries: 920 },
  { date: '2025-06-23', cases: 800, deaths: 16, recoveries: 780 },
  { date: '2025-06-24', cases: 750, deaths: 15, recoveries: 720 },
  { date: '2025-06-25', cases: 690, deaths: 14, recoveries: 670 }
])

const createCasesChart = () => {
  if (casesChartInstance) {
    casesChartInstance.destroy()
  }

  casesChartInstance = new Chart(casesChart.value, {
    type: 'line',
    data: {
      labels: chartData.value.labels,
      datasets: [{
        label: 'Nouveaux cas',
        data: chartData.value.cases,
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
        legend: { display: false },
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

const createMortalityChart = () => {
  if (mortalityChartInstance) {
    mortalityChartInstance.destroy()
  }

  mortalityChartInstance = new Chart(mortalityChart.value, {
    type: 'bar',
    data: {
      labels: chartData.value.labels,
      datasets: [{
        label: 'Taux de mortalité (%)',
        data: chartData.value.mortality,
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
        legend: { display: false },
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

const updateChartData = () => {
  // Simuler des données différentes selon la période
  const periods = {
    '7d': {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      cases: [800, 750, 690, 620, 580, 540, 500],
      mortality: [1.2, 1.1, 1.0, 0.9, 0.8, 0.8, 0.7]
    },
    '30d': {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      cases: [5200, 4800, 4200, 3600],
      mortality: [1.5, 1.3, 1.1, 0.9]
    },
    '3m': {
      labels: ['Avr', 'Mai', 'Jun'],
      cases: [15000, 12000, 9000],
      mortality: [2.1, 1.6, 1.2]
    },
    '1y': {
      labels: ['T1', 'T2', 'T3', 'T4'],
      cases: [45000, 38000, 28000, 22000],
      mortality: [3.2, 2.4, 1.8, 1.2]
    }
  }

  chartData.value = periods[selectedPeriod.value]
  
  nextTick(() => {
    createCasesChart()
    createMortalityChart()
  })
}

onMounted(async () => {
  try {
    // Charger les données réelles si disponibles
    const data = await fetchData()
    if (data && data.length > 0) {
      chartData.value.labels = data.slice(-6).map(d => {
        const date = new Date(d.date_reported)
        return date.toLocaleDateString('fr', { month: 'short' })
      })
      chartData.value.cases = data.slice(-6).map(d => d.new_cases)
    }
  } catch (error) {
    console.error('Utilisation des données factices')
  }

  await nextTick()
  createCasesChart()
  createMortalityChart()
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

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto auto;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.map-section {
  grid-row: 1 / 3;
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
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
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
  
  .map-section {
    grid-row: 1;
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