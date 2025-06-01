import { createRouter, createWebHistory } from 'vue-router'

// Import your components
//import Home from '@/components/Home.vue'
import Home from '@/components/Home.vue'
import About from '@/components/About.vue'
import Dashboard from '@/components/Dashboard.vue'
import Datasheet from '@/components/Datasheet.vue'

import ETLManager from '@/components/ETLManager.vue'
import CSVUploader from '@/components/CSVUploader.vue'
import URLDownloader from '@/components/URLDownloader.vue'


const routes = [
  { path: '/', name: 'Accueil', component: Home },
  { path: '/about', name: 'About', component: About, meta: { title: 'À propos' }},
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { title: 'Tableau de bord' }},
  { path: '/datasheet', name: 'Datasheet', component: Datasheet, meta: { title: 'Feuille de données' }},
  { path: '/etl',name: 'EtlManager',component: ETLManager, meta: { title: 'Gestionnaire ETL' }},
  { path: '/etl/upload',name: 'ETLUpload',component: CSVUploader,meta: { title: 'Upload CSV' }},
  { path: '/etl/download',name: 'ETLDownload',component: URLDownloader,meta: { title: 'Télécharger URL' }},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard pour mettre à jour le titre de la page
router.beforeEach((to, from, next) => {
  // Mettre à jour le titre de la page
  if (to.meta.title) {
    document.title = `${to.meta.title} - Mon App`
  }
  next()
})

export default router