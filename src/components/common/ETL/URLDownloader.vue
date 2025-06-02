<template>
  <div class="url-downloader">
    <div class="url-form">
      <h3>Télécharger depuis une URL</h3>
      <form @submit.prevent="downloadFromURL">
        <label>URL du fichier</label>
        <input
          v-model="url"
          type="url"
          placeholder="https://example.com/data.csv"
          :disabled="isDownloading"
          required
        >
        <label>Nom du fichier (optionnel)</label>
        <input
          v-model="filename"
          type="text"
          placeholder="mon-fichier.csv"
          :disabled="isDownloading"
        >
        <button
          type="submit"
          :disabled="isDownloading || !url"
        >
          <span v-if="isDownloading" class="spinner-small"></span>
          {{ isDownloading ? 'Téléchargement...' : 'Télécharger' }}
        </button>
      </form>
      <div v-if="downloadSuccess" class="success-msg">
        <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#eafaf1"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#28a745" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        <span> Fichier téléchargé avec succès !</span>
      </div>
      <div v-if="downloadError" class="error-msg">
        <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#faeaea"/><path d="M9 9l6 6M15 9l-6 6" stroke="#dc3545" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        <span> Erreur: {{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { downloadFromUrl } from '@/services/etlService'

const emit = defineEmits(['download-success', 'download-error'])

const url = ref('')
const filename = ref('')
const isDownloading = ref(false)
const downloadSuccess = ref(false)
const downloadError = ref(false)
const errorMessage = ref('')

const downloadFromURL = async () => {
  if (!url.value) return
  isDownloading.value = true
  downloadSuccess.value = false
  downloadError.value = false
  try {
    await downloadFromUrl(url.value, filename.value || null)
    downloadSuccess.value = true
    emit('download-success')
    setTimeout(() => {
      url.value = ''
      filename.value = ''
      downloadSuccess.value = false
    }, 3000)
  } catch (error) {
    downloadError.value = true
    errorMessage.value = error.message
    emit('download-error', error)
  } finally {
    isDownloading.value = false
  }
}
</script>

<style scoped>
.url-form {
  max-width: 420px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2em 1.5em 1.5em 1.5em;
}
.url-form h3 {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 1em;
  color: #007bff;
}
.url-form label {
  display: block;
  font-size: 0.98em;
  margin-bottom: 0.3em;
  margin-top: 1em;
  color: #333;
}
.url-form input {
  color: #222; /* ou #000 pour noir */
  background: #fff;
  width: 100%;
  padding: 0.6em;
  border: 1px solid #bbb;
  border-radius: 5px;
  margin-bottom: 0.5em;
  font-size: 1em;
  transition: border 0.2s;
}
.url-form input:focus {
  border-color: #007bff;
  outline: none;
}
.url-form button {
  width: 100%;
  background: #007bff;
  color: white;
  padding: 0.8em;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1em;
  margin-top: 1em;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.url-form button:disabled {
  background: #b3d1fa;
  cursor: not-allowed;
}
.success-msg, .error-msg {
  margin-top: 1.2em;
  border-radius: 6px;
  padding: 1em;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1em;
}
.success-msg {
  background: #eafaf1;
  color: #28a745;
  border: 1px solid #28a745;
}
.error-msg {
  background: #faeaea;
  color: #dc3545;
  border: 1px solid #dc3545;
}
.icon {
  width: 28px;
  height: 28px;
  margin-right: 0.7em;
}
.spinner-small {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #fff;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5em;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
</style>