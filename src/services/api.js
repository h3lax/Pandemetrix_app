import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api', //important pour que l'URL soit dyanamique via .env (recommendé) baseURL: 'http://localhost:3000/api', //pour le dev local
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
    // Authorization: `Bearer ${token}`
  }
})

const etl = axios.create({
  baseURL: "http://localhost:5001" + '/api/v1/covid', //important pour que l'URL soit dyanamique via .env (recommendé) baseURL: 'http://localhost:3000/api', //pour le dev local
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
    // Authorization: `Bearer ${token}`
  }
})

export { api, etl }
