<template>
  <div class="ia-analysis-page">
    <h1>Analyse IA / Modèles de Prédictions</h1>

    <!-- Section 1 : Lancer des prédictions -->
    <section class="card">
      <h2>Lancer des prédictions</h2>
      <form @submit.prevent="runPrediction">
        <label for="dataset-select">Jeu de données :</label>
        <select id="dataset-select" v-model="selectedDataset" required>
          <option disabled value="">Sélectionner un dataset</option>
          <option v-for="ds in datasets" :key="ds.id" :value="ds.id">{{ ds.name }}</option>
        </select>
        <label for="model-select">Modèle IA :</label>
        <select id="model-select" v-model="selectedModel" required>
          <option disabled value="">Sélectionner un modèle</option>
          <option v-for="model in models" :key="model.id" :value="model.id">
            {{ model.name }} (v{{ model.version }})
          </option>
        </select>
        <button type="submit" :disabled="loadingPrediction">
          <span v-if="loadingPrediction" class="spinner" aria-hidden="true"></span>
          {{ loadingPrediction ? "Prédiction en cours..." : "Lancer la prédiction" }}
        </button>
      </form>
      <div v-if="predictionResult" class="prediction-result">
        <h3>Résultat de la prédiction</h3>
        <p><strong>Prédiction :</strong> {{ predictionResult.value }}</p>
        <p><strong>Explication :</strong> {{ predictionResult.explanation }}</p>
        <p class="meta">
          <span>Modèle : {{ predictionResult.modelName }} (v{{ predictionResult.modelVersion }})</span>
          <span>Dataset : {{ predictionResult.datasetName }}</span>
          <span>Date : {{ formatDate(predictionResult.date) }}</span>
        </p>
      </div>
      <div v-if="showChart" class="chart-container" style="margin-top:2em;">
        <canvas ref="chartCanvas" aria-label="Graphique de modélisation" role="img"></canvas>
      </div>
    </section>

    <!-- Section 2 : Comparateur de modèles IA -->
    <section class="card">
      <h2>Comparateur de modèles IA</h2>
      <table class="model-table">
        <thead>
          <tr>
            <th>Modèle</th>
            <th>Version</th>
            <th>Précision</th>
            <th>Recall</th>
            <th>F1-score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="model in models" :key="model.id">
            <td>{{ model.name }}</td>
            <td>{{ model.version }}</td>
            <td>{{ model.metrics.precision }}</td>
            <td>{{ model.metrics.recall }}</td>
            <td>{{ model.metrics.f1 }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Section 3 : Timeline d’évolution d’une prédiction -->
    <section class="card">
      <h2>Timeline d’évolution d’une prédiction</h2>
      <div class="timeline">
        <div v-for="event in predictionTimeline" :key="event.date" class="timeline-event">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-date">{{ formatDate(event.date) }}</span>
            <span class="timeline-label">{{ event.label }}</span>
            <span class="timeline-value">{{ event.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4 : Versionning des modèles -->
    <section class="card">
      <h2>Versionning des modèles</h2>
      <table class="version-table">
        <thead>
          <tr>
            <th>Modèle</th>
            <th>Version</th>
            <th>Date de déploiement</th>
            <th>Résultats produits</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="model in models" :key="model.id">
            <td>{{ model.name }}</td>
            <td>{{ model.version }}</td>
            <td>{{ formatDate(model.deployedAt) }}</td>
            <td>
              <ul>
                <li v-for="res in model.results" :key="res.id">
                  {{ res.value }} ({{ formatDate(res.date) }})
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import Chart from 'chart.js/auto'

const datasets = ref([
  { id: 1, name: "Cas quotidiens France", data: [1200, 1500, 1800, 2100, 1700, 1600, 2000] },
  { id: 2, name: "Décès quotidiens France", data: [30, 28, 35, 40, 38, 32, 29] }
])
const models = ref([
  {
    id: 1,
    name: "RandomForest",
    version: "1.2",
    deployedAt: "2024-05-01T10:00:00Z",
    metrics: { precision: 0.91, recall: 0.87, f1: 0.89 },
    results: [
      { id: 1, value: "Classe 1", date: "2024-05-10T12:00:00Z" },
      { id: 2, value: "Classe 2", date: "2024-05-12T15:00:00Z" }
    ]
  },
  {
    id: 2,
    name: "XGBoost",
    version: "2.0",
    deployedAt: "2024-05-15T09:00:00Z",
    metrics: { precision: 0.93, recall: 0.89, f1: 0.91 },
    results: [
      { id: 3, value: "Classe 1", date: "2024-05-18T11:00:00Z" }
    ]
  }
])

const selectedDataset = ref("")
const selectedModel = ref("")
const loadingPrediction = ref(false)
const predictionResult = ref(null)
const showChart = ref(false)
const chartCanvas = ref(null)
let chartInstance = null

const runPrediction = async () => {
  loadingPrediction.value = true
  setTimeout(async () => {
    const model = models.value.find(m => m.id === Number(selectedModel.value))
    const dataset = datasets.value.find(d => d.id === Number(selectedDataset.value))
    predictionResult.value = {
      value: "Prévision : " + Math.round(dataset.data.reduce((a, b) => a + b) / dataset.data.length),
      explanation: "Le modèle a prédit la moyenne sur la semaine.",
      modelName: model.name,
      modelVersion: model.version,
      datasetName: dataset.name,
      date: new Date().toISOString(),
      data: dataset.data
    }
    loadingPrediction.value = false
    showChart.value = true
    await nextTick()
    renderChart()
  }, 1200)
}

function renderChart() {
  if (chartInstance) {
    chartInstance.destroy()
  }
  const dataset = datasets.value.find(d => d.id === Number(selectedDataset.value))
  if (!dataset) return
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      datasets: [{
        label: dataset.name,
        data: dataset.data,
        borderColor: '#1565c0',
        backgroundColor: 'rgba(21,101,192,0.1)',
        pointBackgroundColor: '#00bfae',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, labels: { color: '#222' } },
        title: { display: true, text: 'Modélisation Covid', color: '#1565c0', font: { size: 18 } }
      },
      scales: {
        x: { ticks: { color: '#222' } },
        y: { ticks: { color: '#222' } }
      }
    }
  })
}

// Timeline d’évolution d’une prédiction (exemple)
const predictionTimeline = ref([
  { date: "2024-05-10T12:00:00Z", label: "Prédiction initiale", value: "Classe 1" },
  { date: "2024-05-12T15:00:00Z", label: "Correction manuelle", value: "Classe 2" },
  { date: "2024-05-18T11:00:00Z", label: "Re-prédiction", value: "Classe 1" }
])

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("fr-FR")
}
</script>

<style scoped>
.ia-analysis-page {
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 2em 11em;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: linear-gradient(120deg, #0048ff 0%, #02f76c 100%);
  min-height: 100vh;
  box-sizing: border-box;
}
@media (max-width: 700px) {
  .ia-analysis-page {
    padding: 0.5em 0.2em;
  }
}
.ia-analysis-page h1 {
  text-align: center;
  color:rgb(255, 255, 255); 
  font-size: 2.4em;
  margin-bottom: 1.5em;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 2px 8pxrgb(0, 0, 0);
}
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,123,255,0.07), 0 1.5px 6px rgba(40,167,69,0.04);
  padding: 2em 1.5em;
  margin-bottom: 2em;
  border-left: 7px solid #1565c0;
  transition: box-shadow 0.2s;
}
@media (max-width: 700px) {
  .card {
    padding: 1.2em 0.5em;
    margin-left: 0.2em;
    margin-right: 0.2em;
  }
}
.card h2 {
  color: #1565c0;
  font-size: 1.35em;
  margin-bottom: 1em;
  font-weight: bold;
  letter-spacing: 0.5px;
}
.card form {
  display: flex;
  flex-wrap: wrap;
  gap: 1em 2em;
  align-items: flex-end;
  margin-bottom: 1.2em;
}
.card label {
  width: 100%;
  font-size: 1em;
  color: #222;
  margin-bottom: 0.2em;
  font-weight: 600;
  letter-spacing: 0.2px;
}
.card select,
.card input {
  width: 220px;
  padding: 0.6em;
  border-radius: 5px;
  border: 2px solid #1565c0;
  font-size: 1em;
  margin-bottom: 0.5em;
  background: #f5f8ff;
  color: #1a237e;
  font-weight: 500;
  transition: border 0.2s, box-shadow 0.2s;
}
.card select:focus,
.card input:focus {
  border-color: #00bfae;
  outline: 2px solid #00bfae;
  background: #e3f2fd;
}
.card button {
  background: linear-gradient(90deg, #1565c0 60%, #00bfae 100%);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.7em 1.5em;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(21,101,192,0.08);
}
.card button:focus {
  outline: 3px solid #ffeb3b;
  outline-offset: 2px;
}
.card button:disabled {
  background: #b3d1fa;
  color: #555;
  cursor: not-allowed;
  box-shadow: none;
}
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
  border-top: 2px solid #1565c0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.7em;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.prediction-result {
  background: linear-gradient(90deg, #eafaf1 80%, #f5f8ff 100%);
  border: 2px solid #00bfae;
  border-radius: 10px;
  padding: 1.2em 1.5em;
  margin-top: 1em;
  box-shadow: 0 2px 8px rgba(40,167,69,0.07);
  color: #222;
}
.prediction-result h3 {
  color: #00bfae;
  margin-bottom: 0.5em;
  font-size: 1.15em;
}
.prediction-result p,
.prediction-result strong,
.prediction-result span {
  color: #222;
}
.prediction-result .meta {
  font-size: 1em;
  color: #222;
  margin-top: 0.7em;
  display: flex;
  gap: 1.5em;
  flex-wrap: wrap;
}
.chart-container {
  width: 100%;
  overflow-x: auto;
}
.model-table, .version-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1em;
  background: #f5f8ff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(21,101,192,0.04);
}
.model-table th, .model-table td,
.version-table th, .version-table td {
  border-bottom: 1px solid #e0eaff;
  padding: 1em 0.5em;
  text-align: center;
  font-size: 1em;
}
.model-table th, .version-table th {
  background: #1565c0;
  color: #fff;
  font-weight: bold;
  font-size: 1.08em;
  letter-spacing: 0.5px;
}
.model-table td, .version-table td {
  color: #222;
  background: #f5f8ff;
}
.model-table tr:nth-child(even),
.version-table tr:nth-child(even) {
  background: #eafaf1;
}
.model-table tr:hover,
.version-table tr:hover {
  background: #b3e5fc;
  transition: background 0.2s;
}
.timeline {
  margin-top: 1em;
  border-left: 4px solid #1565c0;
  padding-left: 2em;
  position: relative;
}
.timeline-event {
  position: relative;
  margin-bottom: 1.5em;
}
.timeline-dot {
  position: absolute;
  left: -2.2em;
  top: 0.3em;
  width: 1.2em;
  height: 1.2em;
  background: #fff;
  border: 4px solid #00bfae;
  border-radius: 50%;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0,191,174,0.08);
}
.timeline-content {
  background: #f5f8ff;
  border-radius: 8px;
  padding: 0.8em 1.2em;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  border-left: 3px solid #00bfae;
  color: #222;
}
.timeline-date {
  font-size: 1em;
  color: #333;
}
.timeline-label {
  font-weight: bold;
  color: #1565c0;
  font-size: 1.08em;
}
.timeline-value {
  color: #00bfae;
  font-weight: bold;
  font-size: 1.08em;
}
@media (max-width: 900px) {
  .card form {
    flex-direction: column;
    gap: 0.7em;
  }
  .card select,
  .card input {
    width: 100%;
  }
  .card {
    padding: 1.2em 0.5em;
  }
  .timeline {
    padding-left: 1em;
  }
}
@media (max-width: 600px) {
  .ia-analysis-page {
    padding: 0.5em 0.1em;
  }
  .card {
    padding: 0.7em 0.2em;
    border-radius: 8px;
    margin-left: 0.2em;
    margin-right: 0.2em;
  }
  .timeline-content {
    padding: 0.5em 0.5em;
  }
  .model-table th, .model-table td,
  .version-table th, .version-table td {
    padding: 0.5em 0.2em;
    font-size: 0.95em;
  }
}
</style>