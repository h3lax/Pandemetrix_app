<template>
  <div class="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-center" style="color: #333; font-weight: bold;">Dashboard Pandemetrix</h1>

    <!-- Graphique -->
    <div class="bg-white p-4 rounded-xl shadow max-w-4xl mx-auto">
      <h2 class="text-xl font-semibold mb-4">Nouveaux cas par jour</h2>
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
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

// Enregistre les composants nécessaires
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

// Données du graphique
const chartData = ref({
  labels: [],
  datasets: [{
    label: 'Nouveaux cas',
    backgroundColor: 'rgba(54, 162, 235, 0.5)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 2,
    fill: true,
    tension: 0.3,
    data: []
  }]
})

// Options de présentation
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#000'
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#000' },
      grid: { color: '#ddd' }
    },
    y: {
      ticks: { color: '#000' },
      grid: { color: '#ddd' }
    }
  }
}

// Récupération des données
onMounted(async () => {
  try {
    const data = await fetchData() // Ex: [{ date_reported: "2024-12-01", new_cases: 123 }, ...]
    chartData.value.labels = data.map(d => d.date_reported)
    chartData.value.datasets[0].data = data.map(d => d.new_cases)
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error)
  }
})
</script>

<style scoped>
.p-6 { padding: 1.5rem; }
.bg-gradient-to-br { 
  background: linear-gradient(to bottom right, var(--color-primary-light), #e0f7fa);
}
.from-blue-100 { /* déjà géré par bg-gradient-to-br */ }
.to-cyan-100 { /* déjà géré par bg-gradient-to-br */ }
.min-h-screen { min-height: 100vh; }

.text-3xl { font-size: 1.875rem; }
.font-bold { font-weight: bold; }
.mb-6 { margin-bottom: 1.5rem; }
.text-center { text-align: center; }

.bg-white { background-color: var(--color-bg-primary); }
.p-4 { padding: 1rem; }
.rounded-xl { border-radius: 0.75rem; }
.shadow { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
.max-w-4xl { max-width: 56rem; }
.mx-auto { margin-left: auto; margin-right: auto; }

.text-xl { font-size: 1.25rem; }
.font-semibold { font-weight: 600; }
.mb-4 { margin-bottom: 1rem; }

div { height: 500px; }

h1, h2 {
  color: var(--color-text-primary);
}
</style>
