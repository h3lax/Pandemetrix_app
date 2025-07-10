<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NavItem from './NavItem.vue'

const { t } = useI18n()

const items = computed(() => [
  { name: t('nav.home'), route: 'Accueil' },
  { name: t('nav.upload'), route: 'EtlManager' },
  { name: t('nav.dashboard'), route: 'Dashboard' },
  { name: t('nav.status'), route: 'Datasheet' },
  { name: t('nav.analysis'), route: 'IAAnalysisPage' },
  { name: t('nav.about'), route: 'About' },
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