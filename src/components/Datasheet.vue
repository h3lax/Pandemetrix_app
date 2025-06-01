<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4"style="color: #333;">Feuille de données</h1>

    <!-- Statut de l'API -->
    <div class="mb-4 flex gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium"style="color: #333;">API:</span>
        <span :class="apiStatus ? 'text-green-600' : 'text-red-600'" class="text-sm">
          {{ apiStatus ? 'ApiStatus ?✔️ Connecté' : 'ApiStatus ? ❌ Déconnecté' }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">DB:</span>
        <span :class="dbStatus ? 'text-green-600' : 'text-red-600'" class="text-sm">
          {{ dbStatus ? 'DbStatus ?✔️ Connecté' : 'DbStatus ? ❌ Déconnecté' }}
        </span>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-if="loading" class="text-gray-500">Chargement des données...</div>
    <div v-else-if="error" class="text-red-600">Erreur : {{ error }}</div>
    <div v-else-if="!data.length" class="text-gray-500">Aucune donnée disponible</div>
    <table v-else class="w-full table-auto border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th v-for="(header, index) in headers" :key="index" class="px-4 py-2 border">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="(header, colIndex) in headers" :key="colIndex" class="px-4 py-2 border">
            {{ row[header] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchData, checkAppStatus, checkDbStatus } from '@/services/dataServices'

const data = ref([])
const headers = ref([])
const loading = ref(true)
const error = ref(null)
const apiStatus = ref(false)
const dbStatus = ref(false)

// Vérifier les statuts
const checkStatuses = async () => {
  try {
    await checkAppStatus()
    apiStatus.value = true
  } catch {
    apiStatus.value = false
  }

  try {
    await checkDbStatus()
    dbStatus.value = true
  } catch {
    dbStatus.value = false
  }
}

onMounted(async () => {
  // Vérifier les statuts en premier
  await checkStatuses()
  
  // Charger les données seulement si l'API est disponible
  if (apiStatus.value) {
    try {
      const result = await fetchData()
      data.value = Array.isArray(result) ? result : []
      headers.value = data.value.length ? Object.keys(data.value[0]) : []
    } catch (err) {
      error.value = err.message
    }
  } else {
    error.value = 'API non disponible'
  }
  
  loading.value = false
})
</script>

<style scoped>
table {
  border-collapse: collapse;
}
</style>