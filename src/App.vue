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
  <div id="app">
    <!-- Skip Links -->
    <div class="skip-links">
      <a href="#main-content" class="skip-link">Aller au contenu principal</a>
      <a href="#main-navigation" class="skip-link">Aller à la navigation</a>
    </div>
    
    <Header />
    
    <main id="main-content" role="main" tabindex="-1">
      <router-view />
    </main>
    
    <footer role="contentinfo" class="sr-only">
      <p>Pandemetrix - Modèle prédictif de pandémies</p>
    </footer>
  </div>
</template>

<style>
.skip-links {
  position: absolute;
  top: -40px;
  left: 6px;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  color: #000;
  background: #fff;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  border: 2px solid #000;
}

.skip-link:focus {
  position: static;
  width: auto;
  height: auto;
  left: auto;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
