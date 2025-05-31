import { createRouter, createWebHistory } from 'vue-router'

// Import your components
//import Home from '@/components/Home.vue'
import Home from '@/components/Home.vue'
import About from '@/components/About.vue'
import Dashboard from '@/components/Dashboard.vue'
import Datasheet from '@/components/Datasheet.vue'

//Pour du lazy loading on utilise une fonction callback pour importer le composant
const routes = [
  { path: '/', name: 'Accueil', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/datasheet', name: 'Datasheet', component: Datasheet } 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router