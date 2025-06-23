<script setup>
    import { ref } from 'vue'
    import NavItem from './NavItem.vue';
    import Navbar from './Navbar.vue';

    const props = defineProps({
        title: {
            type: String,
            default: 'Pandemetrix'
        },
        subtitle: {
            type: String,
            default: 'pandemic predictive model'
        }
    })
</script>

<template>
  <header role="banner" class="header-main">
    <div class="header-container">
      <div class="header-content">
        <h1 class="header-title">{{ title }}</h1>
        <p class="header-subtitle">{{ subtitle }}</p>
      </div>
      <Navbar />
    </div>
  </header>
</template>

<style scoped>
.header-main {
  min-height: 60vh; 
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%);
  padding: 2rem 0; display: flex; flex-direction: column;
}

.header-container {
  width: 100%; height: 100%; padding-top: 10rem; margin: 0 auto;
  padding-left: 1rem; padding-right: 1rem; flex-grow: 1; flex-shrink: 1;
  flex-basis: auto; display: flex; flex: 1 1 auto; flex-direction: column;
  justify-content: space-between; align-items: center;
}

.header-content { margin-top: 2rem; }

.header-title {
  font-size: 4.5rem; font-weight: 800; color: var(--color-warning);
  display: inline-block; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-subtitle {
  font-size: 1.25rem; text-align: center; margin-top: 0.5rem;
  color: var(--color-warning); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .header-title { font-size: 3rem; }
  .header-subtitle { font-size: 1.125rem; }
}
</style>