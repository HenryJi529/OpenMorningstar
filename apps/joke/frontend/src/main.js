import './assets/css/tailwindcss.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import MasonryWall from '@yeger/vue-masonry-wall'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faQuestion, faRotate } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faQuestion, faRotate)

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(MasonryWall)

app.mount('#app')
