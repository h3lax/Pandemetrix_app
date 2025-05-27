<template>
  <div class="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-center">Tableau de bord Pandemetrix</h1>

    <!-- Filtres -->
    <div class="flex flex-wrap gap-4 justify-center mb-8">
      <button
        v-for="f in filters"
        :key="f"
        @click="applyFilter(f)"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        {{ f }}
      </button>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-xl font-semibold mb-2">Cas par jour</h2>
        <canvas ref="lineChart"></canvas>
      </div>

      <div class="bg-white p-4 rounded-xl shadow">
        <h2 class="text-xl font-semibold mb-2">Distribution par région</h2>
        <canvas ref="barChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'

const lineChart = ref(null)
const barChart = ref(null)

const filters = ['7 derniers jours', '30 derniers jours', 'Tout']

function applyFilter(filter) {
  alert(`Filtre appliqué : ${filter} (implémentation à venir)`)
}

onMounted(() => {
  // Graphique en ligne
  new Chart(lineChart.value, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{
        label: 'Nouveaux cas',
        data: [120, 190, 300, 500, 200, 300, 450],
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })

  // Graphique en barres
  new Chart(barChart.value, {
    type: 'bar',
    data: {
      labels: ['Nord', 'Sud', 'Est', 'Ouest'],
      datasets: [{
        label: 'Cas confirmés',
        data: [300, 500, 100, 200],
        backgroundColor: [
          '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
})
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 300px !important;
}
</style>
