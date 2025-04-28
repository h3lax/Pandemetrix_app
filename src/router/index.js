import { createRouter, createWebHistory } from 'vue-router'

// Import your components
//import Home from '@/components/Home.vue'
import Home from '@/components/Home.vue'
import About from '@/components/About.vue'
//import About from '@/components/About.vue'
//import Dashboard from '@/components/Dashboard.vue'

//Pour du lazy loading on utilise une fonction callback pour importer le composant
const routes = [
  { path: '/', name: 'Accueil', component: () => import('@/components/Home.vue')},
  { path: '/about', name: 'About', component: About },
  //{ path: '/dashboard', name: 'Dashboard', component: Dashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
