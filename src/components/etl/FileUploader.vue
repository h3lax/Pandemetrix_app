<template>
    <div class="bg-white p-6 rounded-xl shadow max-w-md w-full mx-auto">
      <h2 class="text-xl font-semibold mb-4">Upload de CSV</h2>
  
      <form @submit.prevent="handleUpload" class="space-y-4">
        <input
          type="text"
          v-model="title"
          placeholder="Titre du fichier"
          class="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
  
        <input
          type="file"
          accept=".csv"
          @change="onFileChange"
          class="w-full"
        />
  
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  
        <button
          type="submit"
          :disabled="!file || !title"
          class="w-full py-2 px-4 rounded-lg text-white font-semibold"
          :class="(!file || !title) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
        >
          Upload
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { uploadCSV } from '@/services/etlService'
  
  const title = ref('')
  const file = ref(null)
  const error = ref(null)
  
  const onFileChange = (e) => {
    file.value = e.target.files[0]
  }
  
  const handleUpload = async () => {
    error.value = null
  
    if (!title.value || !file.value) {
      error.value = 'Veuillez remplir tous les champs.'
      return
    }
  
    try {
      const result = await uploadCSV(file.value, title.value)
      console.log('Succès:', result)
    } catch (e) {
      error.value = 'Échec de l\'upload.'
    }
  }
  </script>
  