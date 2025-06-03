import { createRouter, createWebHistory } from 'vue-router'

// Import your components
//import Home from '@/components/Home.vue'
import Home from '@/components/home/Home.vue'
import About from '@/components/About.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import Datasheet from '@/components/Status.vue'

import ETLManager from '@/components/etl/EtlMain.vue'
import CSVUploader from '@/components/etl/CSVUploader.vue'
import URLDownloader from '@/components/etl/URLDownloader.vue'

import IAAnalysisPage from '@/components/IAAnalysisPage.vue'

const routes = [
  { path: '/', name: 'Accueil', component: Home },
  { path: '/about', name: 'About', component: About, meta: { title: 'À propos' }},
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { title: 'Tableau de bord' }},
  { path: '/datasheet', name: 'Datasheet', component: Datasheet, meta: { title: 'Feuille de données' }},
  { path: '/etl',name: 'EtlManager',component: ETLManager, meta: { title: 'Gestionnaire ETL' }},
  { path: '/etl/upload',name: 'ETLUpload',component: CSVUploader,meta: { title: 'Upload CSV' }},
  { path: '/etl/download',name: 'ETLDownload',component: URLDownloader,meta: { title: 'Télécharger URL' }},
  { path: '/analyse-ia', name: 'IAAnalysisPage', component: IAAnalysisPage, meta: { title: 'Analyse IA' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard pour mettre à jour le titre de la page
router.beforeEach((to, from, next) => {
  // Mettre à jour le titre de la page
  if (to.meta.title) {
    document.title = `${to.meta.title} | Pandemetrix`
  }
  next()
})

export default router