<template>
  <div class="url-downloader">
    <div class="url-form">
      <h3 style="font-size: 1.1em; font-weight: bold; margin-bottom: 1em;">Télécharger depuis une URL</h3>
      <form @submit.prevent="downloadFromURL">
        <div style="margin-bottom: 0.7em;">
          <label style="display: block; font-size: 0.95em; margin-bottom: 0.3em;">URL du fichier</label>
          <input
            v-model="url"
            type="url"
            placeholder="https://example.com/data.csv"
            :disabled="isDownloading"
            required
            style="width: 100%; padding: 0.5em; border: 1px solid #bbb; border-radius: 4px;"
          >
        </div>
        <div style="margin-bottom: 0.7em;">
          <label style="display: block; font-size: 0.95em; margin-bottom: 0.3em;">Nom du fichier (optionnel)</label>
          <input
            v-model="filename"
            type="text"
            placeholder="mon-fichier.csv"
            :disabled="isDownloading"
            style="width: 100%; padding: 0.5em; border: 1px solid #bbb; border-radius: 4px;"
          >
        </div>
        <button
          type="submit"
          :disabled="isDownloading || !url"
          style="width: 100%; background: #007bff; color: white; padding: 0.7em; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;"
        >
          <span v-if="isDownloading" class="spinner-small" style="margin-right: 0.5em;"></span>
          {{ isDownloading ? 'Téléchargement...' : 'Télécharger' }}
        </button>
      </form>
      <div v-if="downloadSuccess" style="margin-top: 1em; background: #eafaf1; border: 1px solid #28a745; border-radius: 4px; padding: 0.7em;">
        <p style="color: #28a745;">✓ Fichier téléchargé avec succès !</p>
      </div>
      <div v-if="downloadError" style="margin-top: 1em; background: #faeaea; border: 1px solid #dc3545; border-radius: 4px; padding: 0.7em;">
        <p style="color: #dc3545;">✗ Erreur: {{ errorMessage }}</p>
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
.spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  vertical-align: middle;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
</style>