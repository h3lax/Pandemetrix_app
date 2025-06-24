<script setup>
const props = defineProps({
  name: { type: String, required: true },
  to: { type: String, required: true }
})
</script>

<template>
  <router-link 
    class="nav-item" 
    :to="{ name: to }"
    :aria-current="$route.name === to ? 'page' : null"
  >
    {{ name }}
  </router-link>
</template>

<style scoped>
.nav-item {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.75rem 1rem; border-radius: 4px; text-decoration: none;
  color: var(--color-bg-primary); font-weight: 500; font-size: 0.9rem;
  background: rgba(255,255,255,0.1); border: 2px solid transparent;
  transition: all 0.2s ease; min-height: 44px;
}
.nav-item:hover {
  background: rgba(255,255,255,0.2); transform: translateY(-1px);
}
.nav-item[aria-current="page"] {
  background: rgba(255,255,255,0.3); font-weight: 700;
}
</style>