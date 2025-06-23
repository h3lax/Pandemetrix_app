<script setup>
    import { ref } from 'vue'
    import NavItem from './NavItem.vue';

    const items = ref([
        { name: 'Accueil', route: 'Accueil' },
        { name: 'Upload Dataset', route: 'EtlManager' },
        { name: 'Dashboard', route: 'Dashboard' },  
        { name: 'Status', route: 'Datasheet' },
        { name: 'Analysis-IA', route: 'IAAnalysisPage' },
        { name: 'A Propos', route: 'About' },
    ]);
</script>

<template>
    <nav class="flex items-end mt-2 gap-6 ml-auto mr-4">
        <NavItem v-for="item of items" :key="item.name" :name="item.name" :to="item.route" />
    </nav>
</template>

<style scoped>
nav {
  display: flex; align-items: flex-end; margin-top: 0.5rem;
  gap: 1.5rem; margin-left: auto; margin-right: 1rem;
}

ul {
  display: flex; gap: 1.5rem; list-style: none; margin: 0; padding: 0;
}

.nav-link {
  padding: 1rem; border-radius: 0.375rem; color: var(--color-bg-primary);
  text-decoration: none; border: 2px solid transparent;
  transition: all 0.2s ease; font-weight: 500;
}

.nav-link:hover, .nav-link:focus {
  background-color: rgba(255, 255, 255, 0.2);
  outline: 2px solid var(--color-focus); outline-offset: 2px;
}

.nav-link[aria-current="page"] {
  background-color: rgba(255, 255, 255, 0.2); font-weight: bold;
}

@media (max-width: 768px) {
  nav { gap: 1rem; }
  ul { gap: 1rem; }
  .nav-link { padding: 0.75rem; font-size: 0.9rem; }
}
</style>