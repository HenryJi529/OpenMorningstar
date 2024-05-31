import './assets/tailwindcss.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from "axios";
axios.defaults.baseURL = process.env.BASE_URL

import App from './App.vue'
// import router from './router'

const app = createApp(App)

app.use(createPinia())
// app.use(router)

app.mount('#app')
