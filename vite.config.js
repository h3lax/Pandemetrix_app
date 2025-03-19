import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()],
  server: {
    host: '0.0.0.0',  // Expose the app to all network interfaces
    port: 5173         // (same as in docker-compose.yml)
  }
})