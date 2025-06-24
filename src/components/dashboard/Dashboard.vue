<template>
  <main class="dashboard">
    <h1 class="dashboard-title">Tableau de bord Pandemetrix</h1>

    <section aria-labelledby="chart-section-title" class="chart-section">
      <h2 id="chart-section-title" class="chart-title">Évolution des nouveaux cas</h2>
      
      <div class="chart-container">
        <!-- Description textuelle -->
        <div id="chart-description" class="chart-description">
          <h3 class="sr-only">Description du graphique</h3>
          <p v-if="chartData.datasets[0].data.length">
            Graphique linéaire présentant l'évolution de {{ chartData.datasets[0].data.length }} points de données 
            du {{ chartData.labels[0] }} au {{ chartData.labels[chartData.labels.length - 1] }}.
            Valeur minimale : {{ Math.min(...chartData.datasets[0].data).toLocaleString() }},
            valeur maximale : {{ Math.max(...chartData.datasets[0].data).toLocaleString() }}.
          </p>
        </div>

        <!-- Données tabulaires -->
        <details class="chart-data-table">
          <summary>Afficher les données sous forme de tableau</summary>
          <table aria-labelledby="chart-section-title">
            <caption>Données détaillées du graphique des nouveaux cas par jour</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Nouveaux cas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, index) in chartData.datasets[0].data" :key="index">
                <th scope="row">{{ chartData.labels[index] }}</th>
                <td>{{ value.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </details>

        <!-- Graphique -->
        <div class="chart-wrapper">
          <Line 
            :data="chartData" 
            :options="chartOptions"
            role="img"
            :aria-labelledby="'chart-section-title'"
            :aria-describedby="'chart-description'"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchData } from '@/services/dataServices'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const chartData = ref({
  labels: [],
  datasets: [{
    label: 'Nouveaux cas',
    backgroundColor: 'rgba(21, 101, 192, 0.1)',
    borderColor: 'rgb(21, 101, 192)',
    borderWidth: 3,
    fill: true,
    tension: 0.3,
    pointBackgroundColor: 'rgb(21, 101, 192)',
    pointBorderColor: 'rgb(255, 255, 255)',
    pointBorderWidth: 2,
    data: []
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      callbacks: {
        title: (context) => `Date : ${context[0].label}`,
        label: (context) => `Nouveaux cas : ${context.raw.toLocaleString()}`
      },
      backgroundColor: 'rgba(33, 33, 33, 0.9)',
      titleColor: 'rgb(255, 255, 255)',
      bodyColor: 'rgb(255, 255, 255)'
    }
  },
  scales: {
    x: {
      ticks: { 
        color: 'rgb(33, 33, 33)',
        maxRotation: 45
      },
      grid: { color: 'rgba(0, 0, 0, 0.1)' },
      title: {
        display: true,
        text: 'Date',
        color: '#ffffff',
        font: { size: 14, weight: 'bold' }
      }
    },
    y: {
      ticks: { 
        color: '#ffffff',
        callback: function(value) {
          return value.toLocaleString()
        }
      },
      grid: { color: 'rgb(33, 33, 33)' },
      title: {
        display: true,
        text: 'Nombre de cas',
        color: '#ffffff',
        font: { size: 14, weight: 'bold' }
      }
    }
  },
  elements: {
    point: {
      hoverRadius: 8
    }
  }
}

onMounted(async () => {
  try {
    const data = await fetchData()
    chartData.value.labels = data.map(d => d.date_reported)
    chartData.value.datasets[0].data = data.map(d => d.new_cases)
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error)
    // Annoncer l'erreur aux lecteurs d'écran
    const alerter = document.getElementById('alerts')
    if (alerter) {
      alerter.textContent = 'Erreur lors du chargement des données du graphique'
    }
  }
})
</script>

<style scoped>
.dashboard {
  padding: 2rem 1rem; max-width: 1200px; margin: 0 auto;
  background: linear-gradient(135deg, #121212 0%, #373737 100%);
  min-height: 100vh;
}
.dashboard-title {
  font-size: 2.5rem; font-weight: bold; text-align: center;
  margin-bottom: 2rem; color: var(--color-text-primary);
}
.chart-section {
  background: var(--color-bg-primary); border-radius: 12px;
  padding: 2rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.chart-title {
  font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem;
  color: var(--color-text-primary);
}
.chart-description {
  background: var(--color-bg-secondary); padding: 1rem;
  border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--color-primary);
}
.chart-data-table {
  margin: 1rem 0; border: 1px solid var(--color-border); border-radius: 8px;
}
.chart-data-table summary {
  cursor: pointer; font-weight: bold; padding: 1rem;
  background: var(--color-bg-secondary); border-radius: 8px 8px 0 0;
}
.chart-data-table table {
  width: 100%; margin: 0;
}
.chart-data-table th,
.chart-data-table td {
  padding: 0.75rem; border-bottom: 1px solid var(--color-border);
}
.chart-data-table th {
  background: var(--color-bg-secondary); text-align: left;
}
.chart-data-table td {
  text-align: right; font-variant-numeric: tabular-nums;
}
.chart-wrapper {
  height: 400px; position: relative; margin-top: 1rem;
}
@media (max-width: 768px) {
  .dashboard { padding: 1rem 0.5rem; }
  .chart-section { padding: 1rem; }
  .dashboard-title { font-size: 2rem; }
  .chart-wrapper { height: 300px; }
}
</style>