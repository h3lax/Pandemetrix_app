<template>
  <main class="status-page">
    <h1 class="page-title">Statut du système</h1>

    <section aria-labelledby="api-status-title" class="status-section">
      <h2 id="api-status-title" class="section-title">État des services</h2>
      <div class="status-grid">
        <div class="status-item">
          <span class="status-label">API :</span>
          <span 
            :class="apiStatus ? 'success' : 'error'" 
            class="status-value"
            :aria-label="`API ${apiStatus ? 'connectée' : 'déconnectée'}`"
          >
            {{ apiStatus ? '✓ Connecté' : '✗ Déconnecté' }}
          </span>
        </div>
        <div class="status-item">
          <span class="status-label">Base de données :</span>
          <span 
            :class="dbStatus ? 'success' : 'error'" 
            class="status-value"
            :aria-label="`Base de données ${dbStatus ? 'connectée' : 'déconnectée'}`"
          >
            {{ dbStatus ? '✓ Connecté' : '✗ Déconnecté' }}
          </span>
        </div>
      </div>
    </section>

    <section aria-labelledby="data-title" class="data-section">
      <h2 id="data-title" class="section-title">Collections de données</h2>
      
      <div v-if="loading" class="loading" role="status" aria-live="polite">
        <div class="spinner" aria-hidden="true"></div>
        <p>Chargement des données...</p>
      </div>
      
      <div v-else-if="error" class="error-alert" role="alert">
        <strong>Erreur :</strong> {{ error }}
        <button @click="checkStatuses" class="btn btn-secondary">Réessayer</button>
      </div>
      
      <p v-else-if="!data.length" class="empty-state">
        Aucune collection de données disponible
      </p>
      
      <div v-else class="table-container">
        <table class="data-table" role="table" aria-labelledby="data-title">
          <caption class="table-caption">
            Liste des {{ data.length }} collections de données avec leur nombre de documents
          </caption>
          <thead>
            <tr>
              <th scope="col" class="sortable">
                <button 
                  class="sort-button"
                  @click="sortBy('collection')"
                  :aria-sort="getSortDirection('collection')"
                >
                  Nom de la collection
                  <span class="sort-icon" aria-hidden="true">{{ getSortIcon('collection') }}</span>
                </button>
              </th>
              <th scope="col" class="sortable">
                <button 
                  class="sort-button"
                  @click="sortBy('count')"
                  :aria-sort="getSortDirection('count')"
                >
                  Nombre de documents
                  <span class="sort-icon" aria-hidden="true">{{ getSortIcon('count') }}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in sortedData" :key="item.collection">
              <th scope="row" class="collection-name">{{ item.collection }}</th>
              <td class="document-count">
                <span :aria-label="`${item.count.toLocaleString()} documents`">
                  {{ item.count.toLocaleString() }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { checkAppStatus, checkDbStatus } from '@/services/dataServices'
import { getCollections } from '@/services/etlService'

const data = ref([])
const loading = ref(true)
const error = ref(null)
const apiStatus = ref(false)
const dbStatus = ref(false)
const sortField = ref('')
const sortDirection = ref('asc')

const sortedData = computed(() => {
  if (!sortField.value) return data.value
  
  return [...data.value].sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]
    const modifier = sortDirection.value === 'asc' ? 1 : -1
    
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal) * modifier
    }
    return (aVal - bVal) * modifier
  })
})

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  
  announceToScreenReader(`Tableau trié par ${field} ${sortDirection.value === 'asc' ? 'croissant' : 'décroissant'}`)
}

const getSortDirection = (field) => {
  if (sortField.value !== field) return 'none'
  return sortDirection.value === 'asc' ? 'ascending' : 'descending'
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return '↕'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

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

const announceToScreenReader = (message) => {
  const announcer = document.getElementById('announcements')
  if (announcer) {
    announcer.textContent = message
    setTimeout(() => { announcer.textContent = '' }, 1000)
  }
}

onMounted(async () => {
  await checkStatuses()
  
  if (apiStatus.value) {
    try {
      const result = await getCollections()
      data.value = Array.isArray(result.collections) ? result.collections : []
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
.status-page { padding: 2rem 1rem; max-width: 1200px; margin: 0 auto; }
.page-title { font-size: 2rem; margin-bottom: 2rem; text-align: center; }
.section-title { font-size: 1.5rem; margin-bottom: 1rem; }
.status-section { margin-bottom: 3rem; }
.status-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem; margin-bottom: 2rem;
}
.status-item {
  background: var(--color-bg-secondary); padding: 1rem; border-radius: 8px;
  display: flex; justify-content: space-between; align-items: center;
}
.status-label { font-weight: 600; }
.status-value { font-weight: bold; }
.data-section { margin-bottom: 2rem; }
.table-container { overflow-x: auto; margin-top: 1rem; }
.table-caption {
  caption-side: top; padding: 1rem; font-weight: 600;
  text-align: left; background: var(--color-bg-secondary);
}
.data-table {
  width: 100%; background: var(--color-bg-primary);
  border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden;
}
.data-table th { background: var(--color-primary); color: var(--color-bg-primary); }
.sortable { position: relative; }
.sort-button {
  background: none; border: none; color: inherit; font: inherit;
  cursor: pointer; width: 100%; text-align: left; padding: 0;
  display: flex; justify-content: space-between; align-items: center;
}
.sort-icon { margin-left: 0.5rem; }
.collection-name { font-weight: 500; }
.document-count { text-align: right; font-variant-numeric: tabular-nums; }
.error-alert {
  background: var(--color-error); color: var(--color-bg-primary);
  padding: 1rem; border-radius: 8px; display: flex;
  justify-content: space-between; align-items: center;
}
.empty-state {
  text-align: center; padding: 2rem; color: var(--color-text-secondary);
  font-style: italic;
}
</style>