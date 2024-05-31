import './assets/css/tailwindcss.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from "axios";
axios.defaults.baseURL = process.env.BASE_URL

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faUserSecret, faLink } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faUserSecret, faLink)

/* 完全导入 */
// import { fas } from '@fortawesome/free-solid-svg-icons';
// library.add(fas);

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
