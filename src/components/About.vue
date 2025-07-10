<template>
  <div class="about-page">
    <h1 class="about-title">{{ t('about.title') }}</h1>
    <p class="about-text">
      {{ t('about.description') }}
    </p>
    <p class="about-subtitle">
      {{ t('about.technologies') }}
    </p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.about-page {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 4rem 1rem; 
  background: linear-gradient(135deg, var(--color-warning) 0%, var(--color-success) 100%);
}

.about-title {
  font-size: 3rem; font-weight: bold; color: var(--color-bg-primary);
  margin-bottom: 1.5rem; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.about-text {
  font-size: 1.25rem; color: var(--color-bg-primary); max-width: 48rem;
  line-height: 1.6; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.about-subtitle {
  font-size: 1rem; color: var(--color-bg-primary); margin-top: 1.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .about-title { font-size: 2rem; }
  .about-text { font-size: 1.125rem; }
}
</style>