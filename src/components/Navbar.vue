<script setup>
    import { ref } from 'vue'
    import NavItem from './NavItem.vue';

    const items = ref([
        //{ name: 'Legal', route: '#' },
        { name: 'Accueil', route: 'Accueil' },
        { name: 'Upload Dataset', route: 'EtlManager' },
        { name: 'Dashboard', route: 'Dashboard' },
        
        //{ name: 'Etl', route: '#' },
        
        { name: 'Feuille de données', route: 'Datasheet' },
        //{ name: 'Graphique', route: 'ChartTest' }
        //{ name: 'Un autre', route: '#' },
        //{ name: 'Et là?', route: '#' }
        { name: 'Analysis-IA', route: 'IAAnalysisPage' },
        { name: 'A Propos', route: 'About' },
    ]);
</script>

<template>
    <nav class="flex items-end mt-2 gap-6 ml-auto mr-4">
        <NavItem v-for="item of items" :key="item.name" :name="item.name" :to="item.route" />
    </nav>
</template>