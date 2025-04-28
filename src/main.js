import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App);
app.config.globalProperties.$apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
app.use(router);
app.mount('#app');