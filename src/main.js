import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App);
app.config.globalProperties.$apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
app.use(router);
app.use(i18n);
app.mount('#app');