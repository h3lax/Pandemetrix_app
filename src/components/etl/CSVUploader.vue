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
          <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#eafaf1"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#28a745" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          <p style="color: #28a745; font-weight: bold;">Fichier uploadé avec succès !</p>
          <p class="filename">{{ uploadedFile?.name }}</p>
        </div>
        <div v-else-if="uploadError" class="error-state">
          <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#faeaea"/><path d="M9 9l6 6M15 9l-6 6" stroke="#dc3545" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          <p style="color: #dc3545; font-weight: bold;">Erreur d'upload</p>
          <p class="filename">{{ errorMessage }}</p>
        </div>
        <div v-else class="default-state">
          <svg class="icon" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#e6f0ff"/><path d="M12 8v6M9 11l3 3 3-3" stroke="#007bff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          <p style="color: #007bff; font-weight: bold;">Glissez votre fichier CSV ici</p>
          <p class="filename">ou cliquez pour sélectionner</p>
        </div>
      </div>
    </div>
    <div v-if="uploadedFile && !isUploading" class="file-info">
      <div class="file-card">
        <div>
          <p class="file-title">{{ uploadedFile.name }}</p>
          <p class="file-size">{{ formatFileSize(uploadedFile.size) }}</p>
        </div>
        <button @click="resetUpload" class="delete-btn">Supprimer</button>
      </div>
    </div>
  </div>
  <TitleModal
    v-if="showTitlePrompt"
    @title-submitted="onTitleSubmitted"
    @cancel="onTitleCancelled"
  />
</template>

<script setup>
import { ref } from 'vue'
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
const fileTitle = ref('')

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
  if (file.size > 40 * 1024 * 1024) {
    showError('Le fichier est trop volumineux (max 40MB)')
    return
  }
  /*
  let title = prompt("Quel est le titre du fichier ?", "Ex : Données mai 2025")
  if (!title || title.trim().length === 0) {
    showError("Vous devez entrer un titre pour le fichier.")
    return
  }
  title = title.trim().toLocaleLowerCase()
  console.log({
    title: title,
    fileName: file.fileNamename,
  })
  */

  pendingFile.value = file
  showTitlePrompt.value = true
  uploadedFile.value = file
  await uploadFile(file, title);
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

const onTitleSubmitted = async (title) => {
  showTitlePrompt.value = false
  const file = pendingFile.value
  pendingFile.value = null

  uploadedFile.value = file
  await uploadFile(file, title.toLocaleLowerCase())
}

const onTitleCancelled = () => {
  showTitlePrompt.value = false
  pendingFile.value = null
  showError("L'utilisateur a annulé la saisie du titre.")
}
</script>

<style scoped>
.csv-uploader {
  max-width: 420px;
  margin: 0 auto;
}
.drop-zone {
  border: 2px dashed #007bff;
  border-radius: 12px;
  padding: 2.5em 1em;
  text-align: center;
  cursor: pointer;
  background: #3f88d100;
  transition: border 0.2s, background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 1em;
}
.drop-zone.drag-over {
  border-color: #007bff;
  background: #e6f0ff;
  box-shadow: 0 4px 16px rgba(0,123,255,0.08);
}
.drop-zone.uploading {
  border-color: #007bff;
  background: #e6f0ff;
  cursor: not-allowed;
}
.drop-zone.success {
  border-color: #28a745;
  background: #eafaf1;
}
.drop-zone.error {
  border-color: #dc3545;
  background: #faeaea;
}
.drop-content p {
  margin: 0.5em 0 0 0;
  font-size: 1.1em;
}
.drop-content .filename {
  font-size: 0.95em;
  color: #888;
}
.icon {
  width: 38px;
  height: 38px;
  margin-bottom: 0.5em;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.file-info {
  margin-top: 1em;
}
.file-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  padding: 0.7em 1em;
  border-radius: 7px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.file-title {
  color: #007bff;
  font-weight: bold;
  font-size: 1em;
}
.file-size {
  font-size: 0.92em;
  color: #888;
}
.delete-btn {
  color: #fff;
  background: #dc3545;
  border: none;
  border-radius: 4px;
  padding: 0.4em 1em;
  cursor: pointer;
  font-size: 0.95em;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #b52a37;
}
.spinner {
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