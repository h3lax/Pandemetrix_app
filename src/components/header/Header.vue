<script setup>
import { ref } from 'vue'
import NavItem from './NavItem.vue'
import Navbar from './Navbar.vue'

const props = defineProps({
  title: { type: String, default: 'Pandemetrix' },
  subtitle: { type: String, default: 'pandemic predictive model' }
})
</script>

<template>
  <header role="banner" class="main-header">
    <div class="header-container">
      <div class="branding">
        <h1 class="site-title">{{ title }}</h1>
        <p class="site-subtitle">{{ subtitle }}</p>
      </div>
      <Navbar />
    </div>
  </header>
</template>

<style scoped>
.main-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%);
  color: var(--color-bg-primary); padding: 2rem 1rem; min-height: 50vh;
  display: flex; align-items: center;
}
.header-container {
  max-width: 1200px; margin: 0 auto; width: 100%;
  display: flex; flex-direction: column; align-items: center; gap: 2rem;
}
.branding { text-align: center; }
.site-title {
  font-size: clamp(2rem, 5vw, 4rem); font-weight: 800; margin-bottom: 0.5rem;
  color: var(--color-warning); text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}
.site-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem); opacity: 0.9;
  color: var(--color-warning);
}
</style>