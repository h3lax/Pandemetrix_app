<script setup>
import { ref } from 'vue'
import NavItem from './NavItem.vue'

const items = ref([
  { name: 'Accueil', route: 'Accueil' },
  { name: 'Upload Dataset', route: 'EtlManager' },
  { name: 'Dashboard', route: 'Dashboard' },
  { name: 'Status', route: 'Datasheet' },
  { name: 'Analysis-IA', route: 'IAAnalysisPage' },
  { name: 'À Propos', route: 'About' },
])
</script>

<template>
  <nav id="main-navigation" role="navigation" aria-label="Navigation principale" class="main-nav">
    <ul role="menubar" class="nav-list">
      <li v-for="item in items" :key="item.name" role="none">
        <NavItem 
          :name="item.name" 
          :to="item.route"
          role="menuitem"
          :aria-current="$route.name === item.route ? 'page' : null"
        />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.main-nav { background: rgba(255,255,255,0.1); border-radius: 8px; padding: 0.5rem; }
.nav-list {
  display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0; padding: 0;
  list-style: none; justify-content: center;
}
@media (max-width: 768px) {
  .nav-list { flex-direction: column; align-items: center; }
}
</style>