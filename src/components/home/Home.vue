<script setup>
import { ref } from 'vue';
import Hero from './HomeItem.vue';

const items = ref([
        { title: 'Accueil', route: 'Accueil', gradiant: 'bg-linear-to-r from-gray-700 via-rose-500 to-orange-400' },
        { title: 'Etl', route: 'EtlManager', gradiant: 'bg-linear-to-r from-gray-600 via-blue-500 to-cyan-400' },
        { title: 'Dashboard', route: 'Dashboard', gradiant: 'bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))]' },
        { title: 'Status', route: 'Datasheet', gradiant: 'bg-linear-to-r from-green-200 via-teal-400 to-cyan-600' },
        { title: 'Analysis IA', route: 'IAAnalysisPage', gradiant: 'bg-linear-to-r from-yellow-500 via-lime-500 to-green-500' },
        { title: 'A Propos', route: 'About', gradiant: 'bg-linear-to-r from-pink-200 via-purple-400 to-indigo-600' }
    ]);

</script>
<template>
    <div>
        <Hero v-for="item of items" :title="item.title" :key="item.title" :gradiant="item.gradiant" :to="item.route"/>  
    </div>
</template>