<template>
  <div class="loading-state" role="status" :aria-label="label">
    <div class="spinner" aria-hidden="true"></div>
    <p class="loading-text">{{ message }}</p>
    <div class="sr-only">{{ announceText }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: String, default: 'Chargement en cours...' },
  label: { type: String, default: 'Chargement en cours, veuillez patienter' },
  announceText: { type: String, default: 'Chargement des données en cours' }
})
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>