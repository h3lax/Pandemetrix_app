import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',  // Expose the app to all network interfaces
    port: 5173         // The port you want the app to run on (same as in docker-compose.yml)
  }
})