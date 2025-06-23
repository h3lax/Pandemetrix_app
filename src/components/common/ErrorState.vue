<template>
  <div class="error-state" role="alert">
    <h3 class="error-title">{{ title }}</h3>
    <p class="error-message">{{ message }}</p>
    <button v-if="retryAction" @click="retryAction" class="retry-button">
      Réessayer
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Une erreur est survenue' },
  message: { type: String, required: true },
  retryAction: { type: Function, default: null }
})
</script>

<style scoped>
.error-state {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
}

.error-title {
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #7f1d1d;
  margin-bottom: 1rem;
}

.retry-button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>