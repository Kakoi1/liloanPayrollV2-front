import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // from .env
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
    withCredentials: true, // important for Laravel auth
})

export default api
