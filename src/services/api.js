import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api', //important pour que l'URL soit dyanamique via .env (recommendé) baseURL: 'http://localhost:3000/api', //pour le dev local
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
    // Authorization: `Bearer ${token}`
  }
})

export default api