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
    <table v-else class="w-full table-auto bg-blue-500 rounded-md mt-8">
      <thead>
        <tr class="border-b-1 border-white">
          <th class="p-4 uppercase">Nom</th>
          <th class="p-4 uppercase">Documents</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.name" class="border-b-1 border-white">
          <td class="p-2">{{ item.collection }}</td>
          <td class="p-2 text-center">{{ item.count }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { checkAppStatus, checkDbStatus } from '@/services/dataServices'
import { getCollections } from '@/services/etlService'

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
      const result = await getCollections()
      console.log('Données récupérées:', result)

      // result.collections is now an array of { name, count }
      data.value = Array.isArray(result.collections) ? result.collections : []

      headers.value = ['Collection', 'Nombre de documents']
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