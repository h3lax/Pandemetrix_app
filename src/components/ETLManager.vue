<template>
  <div class="etl-manager" style="padding: 2em;">
    <h1 style="font-size: 2em; font-weight: bold; margin-bottom: 1em;">Gestionnaire ETL</h1>
    <div style="display: flex; flex-wrap: wrap; gap: 2em; margin-bottom: 2em;">
      <div style="flex: 1 1 300px; min-width: 300px;">
        <h2 style="font-size: 1.2em; font-weight: bold; margin-bottom: 0.7em;">Upload CSV</h2>
        <CSVUploader @upload-success="handleUploadSuccess" @upload-error="handleUploadError" />
      </div>
      <div style="flex: 1 1 300px; min-width: 300px;">
        <h2 style="font-size: 1.2em; font-weight: bold; margin-bottom: 0.7em;">Télécharger URL</h2>
        <URLDownloader @download-success="handleDownloadSuccess" @download-error="handleDownloadError" />
      </div>
    </div>
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1em;">
        <h2 style="font-size: 1.2em; font-weight: bold;">Jobs ETL</h2>
        <button
          @click="refreshJobs"
          :disabled="loadingJobs"
          style="background: #555; color: white; padding: 0.5em 1em; border-radius: 4px; border: none; cursor: pointer;"
        >
          {{ loadingJobs ? 'Chargement...' : 'Actualiser' }}
        </button>
      </div>
      <div v-if="loadingJobs" style="text-align: center; padding: 2em;">
        <div class="spinner"></div>
        <p style="margin-top: 1em; color: #555;">Chargement des jobs...</p>
      </div>
      <div v-else-if="jobs.length === 0" style="text-align: center; padding: 2em; color: #888;">
        Aucun job ETL trouvé
      </div>
      <div v-else>
        <div
          v-for="job in jobs"
          :key="job.id"
          style="background: #fff; border: 1px solid #eee; border-radius: 6px; padding: 1em; margin-bottom: 1em; display: flex; justify-content: space-between; align-items: center;"
        >
          <div>
            <h3 style="font-weight: bold;">{{ job.filename }}</h3>
            <p style="font-size: 0.95em; color: #555;">{{ job.type }} - {{ formatDate(job.created_at) }}</p>
            <span :style="getStatusStyle(job.status)" style="display: inline-block; padding: 0.2em 0.7em; border-radius: 3px; font-size: 0.9em; margin-top: 0.3em;">
              {{ job.status }}
            </span>
          </div>
          <div style="display: flex; gap: 0.5em;">
            <button
              @click="viewJob(job)"
              style="background: #007bff; color: white; padding: 0.4em 1em; border-radius: 4px; border: none; cursor: pointer;"
            >
              Voir
            </button>
            <button
              @click="deleteJob(job.id)"
              :disabled="deletingJobs.includes(job.id)"
              style="background: #dc3545; color: white; padding: 0.4em 1em; border-radius: 4px; border: none; cursor: pointer;"
            >
              {{ deletingJobs.includes(job.id) ? '...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CSVUploader from './CSVUploader.vue'
import URLDownloader from './URLDownloader.vue'
import { getETLJobs, deleteETLJob } from '@/services/etlService'

const jobs = ref([])
const loadingJobs = ref(false)
const deletingJobs = ref([])

const handleUploadSuccess = () => refreshJobs()
const handleUploadError = (error) => { console.error('Erreur upload:', error) }
const handleDownloadSuccess = () => refreshJobs()
const handleDownloadError = (error) => { console.error('Erreur téléchargement:', error) }

const refreshJobs = async () => {
  loadingJobs.value = true
  try {
    jobs.value = await getETLJobs()
  } catch (error) {
    console.error('Erreur chargement jobs:', error)
  } finally {
    loadingJobs.value = false
  }
}
const deleteJob = async (jobId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce job ?')) return
  deletingJobs.value.push(jobId)
  try {
    await deleteETLJob(jobId)
    jobs.value = jobs.value.filter(job => job.id !== jobId)
  } catch (error) {
    console.error('Erreur suppression job:', error)
  } finally {
    deletingJobs.value = deletingJobs.value.filter(id => id !== jobId)
  }
}
const viewJob = (job) => {
  alert('Voir job: ' + JSON.stringify(job, null, 2))
}
const getStatusStyle = (status) => {
  switch (status) {
    case 'completed': return { background: '#eafaf1', color: '#28a745', border: '1px solid #28a745' }
    case 'processing': return { background: '#fffbe6', color: '#b8860b', border: '1px solid #b8860b' }
    case 'failed': return { background: '#faeaea', color: '#dc3545', border: '1px solid #dc3545' }
    default: return { background: '#f5f5f5', color: '#555', border: '1px solid #ccc' }
  }
}
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('fr-FR')
}
onMounted(() => { refreshJobs() })
</script>

<style scoped>
.spinner {
  margin: 0 auto;
  border: 4px solid #eee;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
</style>