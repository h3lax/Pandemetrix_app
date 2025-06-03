<script setup>
import { ref } from 'vue'
import Header from './components/header/Header.vue';

const items = ref([
        { title: 'Legal', gradiant: 'bg-linear-to-r from-gray-600 via-blue-500 to-cyan-400' },
        { title: 'Accueil', gradiant: 'bg-linear-to-r from-gray-700 via-rose-500 to-orange-400' },
        { title: 'Dashboard', gradiant: 'bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))]' },
        { title: 'Etl', gradiant: 'bg-linear-to-r from-green-200 via-teal-400 to-cyan-600' },
        { title: 'A Propos', gradiant: 'bg-linear-to-r from-yellow-500 via-lime-500 to-green-500' },
        { title: 'Un autre', gradiant: 'bg-linear-to-r from-pink-200 via-purple-400 to-indigo-600' }
    ]);

</script>

<template>
  <div>
    <Header />
    <router-view />
    
  </div>

</template>
