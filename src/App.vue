<script setup>
import { ref, onMounted } from 'vue'
import Header from './components/header/Header.vue'

onMounted(() => {
  // Gestion du focus pour skip links
  const skipLinks = document.querySelectorAll('.skip-link')
  skipLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(e.target.getAttribute('href'))
      if (target) {
        target.focus()
        target.scrollIntoView()
      }
    })
  })
})
</script>

<template>
  <div id="app">
    <!-- Skip Navigation -->
    <div class="skip-links">
      <a href="#main-content" class="skip-link">Aller au contenu principal</a>
      <a href="#main-navigation" class="skip-link">Aller à la navigation</a>
    </div>
    
    <Header />
    
    <main id="main-content" role="main" tabindex="-1">
      <h1 class="sr-only">Application Pandemetrix</h1>
      <router-view />
    </main>
    
    <footer role="contentinfo" class="main-footer">
      <div class="footer-content">
        <p>&copy; 2025 Pandemetrix - Modèle prédictif de pandémies</p>
        <nav aria-label="Liens du pied de page">
          <a href="/about">À propos</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </footer>
    
    <!-- Live regions pour annonces -->
    <div aria-live="polite" aria-atomic="true" class="sr-only" id="announcements"></div>
    <div aria-live="assertive" aria-atomic="true" class="sr-only" id="alerts"></div>
  </div>
</template>