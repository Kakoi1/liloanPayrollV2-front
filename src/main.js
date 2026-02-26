import { createApp } from 'vue'
import App from './App.vue'
import router from './Routes/index'

// Tailwind CSS
import './Css/App.css'

// Optional: If using Pinia
// import { createPinia } from 'pinia'
// const pinia = createPinia()

const app = createApp(App)

app.use(router)
// app.use(pinia) // enable if using Pinia

app.mount('#app')
