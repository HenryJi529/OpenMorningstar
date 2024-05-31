import "./assets/css/tailwindcss.css"

import { createApp } from 'vue'

import axios from "axios";
axios.defaults.baseURL = process.env.BASE_URL

import App from './App.vue'

createApp(App).mount('#app')
