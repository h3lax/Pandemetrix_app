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