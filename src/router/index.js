import { createRouter, createWebHistory } from 'vue-router'

// Import your components
//import Home from '@/components/Home.vue'
import Home from '@/components/Home.vue'
import About from '@/components/common/About.vue'
import Dashboard from '@/components/charts/Dashboard.vue'
import Datasheet from '@/components/common/Datasheet.vue'

import ETLManager from '@/components/common/ETL/ETLManager.vue'
import CSVUploader from '@/components/common/ETL/CSVUploader.vue'
import URLDownloader from '@/components/common/ETL/URLDownloader.vue'

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
    document.title = `${to.meta.title} - Mon App`
  }
  next()
})

export default router