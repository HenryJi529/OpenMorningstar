import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";
axios.defaults.baseURL = process.env.BASE_URL

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faTrash } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faUserSecret, faTrash)

/* 完全导入 */
// import { fas } from '@fortawesome/free-solid-svg-icons';
// library.add(fas);

import './assets/main.css'
createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')

