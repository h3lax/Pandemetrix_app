<template>
  <div class="csv-uploader">
    <div
      class="drop-zone"
      :class="{ 'drag-over': isDragOver, 'uploading': isUploading, 'success': uploadSuccess, 'error': uploadError }"
      @drop="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".csv"
        @change="handleFileSelect"
        style="display: none"
      >
      <div class="drop-content">
        <div v-if="isUploading" class="uploading-state">
          <div class="spinner"></div>
          <p>Upload en cours...</p>
        </div>
        <div v-else-if="uploadSuccess" class="success-state">
          <p style="color: green;">Fichier uploadé avec succès !</p>
          <p style="font-size: 0.9em; color: #999;">{{ uploadedFile?.name }}</p>
        </div>
        <div v-else-if="uploadError" class="error-state">
          <p style="color: red;">Erreur d'upload</p>
          <p style="font-size: 0.9em; color: #a00;">{{ errorMessage }}</p>
        </div>
        <div v-else class="default-state">
          <p style="font-size: 1.1em; color: #999 font-weight: bold;">Glissez votre fichier CSV ici</p>
          <p style="font-size: 0.9em; color: #999;">ou cliquez pour sélectionner</p>
        </div>
      </div>
    </div>
    <div v-if="uploadedFile && !isUploading" class="file-info" style="margin-top: 1em;">
      <div style="display: flex; justify-content: space-between; align-items: center; background: #f5f5f5; padding: 0.7em; border-radius: 5px;">
        <div>
          <p style="font-weight: bold;">{{ uploadedFile.name }}</p>
          <p style="font-size: 0.9em; color: #555;">{{ formatFileSize(uploadedFile.size) }}</p>
        </div>
        <button @click="resetUpload" style="color: #a00; background: none; border: none; cursor: pointer;">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { uploadCSV } from '@/services/etlService'

const emit = defineEmits(['upload-success', 'upload-error'])

const fileInput = ref(null)
const isDragOver = ref(false)
const isUploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref(false)
const errorMessage = ref('')
const uploadedFile = ref(null)

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
  if (!isUploading.value) fileInput.value.click()
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
  if (file.size > 10 * 1024 * 1024) {
    showError('Le fichier est trop volumineux (max 10MB)')
    return
  }
  uploadedFile.value = file
  await uploadFile(file)
}
const uploadFile = async (file) => {
  isUploading.value = true
  uploadSuccess.value = false
  uploadError.value = false
  try {
    await uploadCSV(file)
    isUploading.value = false
    uploadSuccess.value = true
    emit('upload-success', { file })
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
}
const resetUpload = () => {
  uploadedFile.value = null
  uploadSuccess.value = false
  uploadError.value = false
  if (fileInput.value) fileInput.value.value = ''
}
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.csv-uploader .drop-zone {
  border: 2px dashed #bbb;
  border-radius: 8px;
  padding: 2em;
  text-align: center;
  cursor: pointer;
  transition: border 0.2s, background 0.2s;
  background: #fafafa;
}
.csv-uploader .drop-zone.drag-over {
  border-color: #007bff;
  background: #e6f0ff;
}
.csv-uploader .drop-zone.uploading {
  border-color: #007bff;
  background: #e6f0ff;
  cursor: not-allowed;
}
.csv-uploader .drop-zone.success {
  border-color: #28a745;
  background: #eafaf1;
}
.csv-uploader .drop-zone.error {
  border-color: #dc3545;
  background: #faeaea;
}
.csv-uploader .spinner {
  margin: 0 auto 1em auto;
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