<script setup>
    import { ref } from 'vue'
    import NavItem from './NavItem.vue';

    const items = ref([
        //{ name: 'Legal', route: '#' },
        { name: 'Accueil', route: 'Accueil' },
        { name: 'Dashboard', route: 'Dashboard' },
        //{ name: 'Etl', route: '#' },
        { name: 'A Propos', route: 'About' },
        //{ name: 'Un autre', route: '#' },
        //{ name: 'Et là?', route: '#' }
    ]);
</script>

<template>
    <nav class="flex items-end mt-2 gap-6 ml-auto mr-4">
        <NavItem v-for="item of items" :key="item.name" :name="item.name" :to="item.route" />
    </nav>
</template>