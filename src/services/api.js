import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // base API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
    // Authorization: `Bearer ${token}`
  }
})

export default api