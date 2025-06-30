<template>
  <div class="csv-uploader">
    <fieldset class="upload-fieldset">
      <legend class="upload-legend">Upload de fichier CSV</legend>
      
      <div
        class="drop-zone"
        :class="dropZoneClasses"
        @drop="handleDrop"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @click="triggerFileInput"
        @keydown.enter="triggerFileInput"
        @keydown.space.prevent="triggerFileInput"
        role="button"
        tabindex="0"
        :aria-label="dropZoneLabel"
        :aria-describedby="ariaDescribedby"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          @change="handleFileSelect"
          class="sr-only"
          aria-describedby="upload-help"
        >
        
        <div class="drop-content">
          <div v-if="isUploading" class="state uploading-state">
            <div class="spinner" role="status" aria-label="Upload en cours"></div>
            <p>Upload en cours...</p>
          </div>
          
          <div v-else-if="uploadSuccess" class="state success-state">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
              <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <p><strong>Fichier uploadé avec succès</strong></p>
            <p class="filename">{{ uploadedFile?.name }}</p>
          </div>
          
          <div v-else-if="uploadError" class="state error-state">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
              <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="2"/>
            </svg>
            <p><strong>Erreur d'upload</strong></p>
            <p id="upload-error" class="error-details">{{ errorMessage }}</p>
          </div>
          
          <div v-else class="state default-state">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" opacity="0.1"/>
              <path d="M12 8v6M9 11l3 3 3-3" stroke="currentColor" stroke-width="2"/>
            </svg>
            <p><strong>Glissez votre fichier CSV ici</strong></p>
            <p id="upload-help">ou cliquez pour sélectionner</p>
          </div>
        </div>
      </div>
    </fieldset>
    
    <!-- Live region pour annonces -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      <span v-if="uploadSuccess">Fichier {{ uploadedFile?.name }} uploadé avec succès</span>
      <span v-if="uploadError">Erreur d'upload : {{ errorMessage }}</span>
    </div>
    
    <TitleModal
      v-if="showTitlePrompt"
      @title-submitted="onTitleSubmitted"
      @cancel="onTitleCancelled"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { uploadCSV } from '@/services/etlService'
import TitleModal from './TitleModal.vue'

const emit = defineEmits(['upload-success', 'upload-error'])

const fileInput = ref(null)
const isDragOver = ref(false)
const isUploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref(false)
const errorMessage = ref('')
const uploadedFile = ref(null)
const showTitlePrompt = ref(false)
const pendingFile = ref(null)

const dropZoneClasses = computed(() => ({
  'drag-over': isDragOver.value,
  'uploading': isUploading.value,
  'success': uploadSuccess.value,
  'error': uploadError.value
}))

const dropZoneLabel = computed(() => {
  if (isUploading.value) return 'Upload en cours, veuillez patienter'
  if (uploadSuccess.value) return 'Fichier uploadé avec succès'
  if (uploadError.value) return `Erreur d'upload : ${errorMessage.value}`
  return 'Zone de dépôt pour fichier CSV. Cliquez ou glissez un fichier ici'
})

const ariaDescribedby = computed(() => {
  if (uploadError.value) return 'upload-error'
  return 'upload-help'
})

const handleDragOver = (e) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragOver.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) handleFile(files[0])
}

const triggerFileInput = () => {
  if (!isUploading.value) fileInput.value?.click()
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) handleFile(file)
}

const handleFile = async (file) => {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    showError('Veuillez sélectionner un fichier CSV')
    return
  }
  if (file.size > 60 * 1024 * 1024) {
    showError('Le fichier est trop volumineux (max 40MB)')
    return
  }
  
  pendingFile.value = file
  uploadedFile.value = file
  showTitlePrompt.value = true
}

const uploadFile = async (file, title) => {
  isUploading.value = true
  uploadSuccess.value = false
  uploadError.value = false
  
  try {
    await uploadCSV(file, title)
    isUploading.value = false
    uploadSuccess.value = true
    emit('upload-success', { file })
    announceToScreenReader(`Fichier ${file.name} uploadé avec succès`)
  } catch (error) {
    isUploading.value = false
    showError(error.message)
    emit('upload-error', error)
  }
}

const showError = (message) => {
  uploadError.value = true
  errorMessage.value = message
  uploadSuccess.value = false
  announceToScreenReader(`Erreur d'upload : ${message}`)
}

const resetUpload = () => {
  uploadedFile.value = null
  uploadSuccess.value = false
  uploadError.value = false
  if (fileInput.value) fileInput.value.value = ''
}

const onTitleSubmitted = async (title) => {
  showTitlePrompt.value = false
  const file = pendingFile.value
  pendingFile.value = null
  await uploadFile(file, title)
}

const onTitleCancelled = () => {
  showTitlePrompt.value = false
  pendingFile.value = null
  resetUpload()
}

const announceToScreenReader = (message) => {
  const announcer = document.getElementById('announcements')
  if (announcer) {
    announcer.textContent = message
    setTimeout(() => { announcer.textContent = '' }, 1000)
  }
}
</script>

<style scoped>
.csv-uploader { max-width: 500px; margin: 0 auto; }
.upload-fieldset { border: none; padding: 0; margin: 0; }
.upload-legend {
  font-size: 1.25rem; font-weight: bold; color: var(--color-text-primary);
  margin-bottom: 1rem;
}
.drop-zone {
  border: 3px dashed var(--color-primary); border-radius: 12px;
  padding: 3rem 2rem; text-align: center; cursor: pointer;
  background: var(--color-bg-primary); transition: all 0.2s ease;
  min-height: 200px; display: flex; align-items: center; justify-content: center;
}
.drop-zone.drag-over {
  border-color: var(--color-secondary); background: var(--color-primary-light);
  transform: scale(1.02);
}
.drop-zone.uploading {
  border-color: var(--color-info); background: var(--color-primary-light);
  cursor: wait;
}
.drop-zone.success {
  border-color: var(--color-success); background: #eafaf1;
}
.drop-zone.error {
  border-color: var(--color-error); background: #fef2f2;
}
.state { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.default-state { color: var(--color-primary); }
.success-state { color: var(--color-success); }
.error-state { color: var(--color-error); }
.uploading-state { color: var(--color-info); }
.icon { width: 48px; height: 48px; }
.filename { font-size: 0.9rem; opacity: 0.8; }
.error-details { font-size: 0.9rem; }
</style>