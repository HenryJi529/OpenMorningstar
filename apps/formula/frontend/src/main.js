import "./assets/css/tailwindcss.css"

import { createApp } from 'vue'
import MathJax, { initMathJax, renderByMathjax } from "mathjax-vue3";
import App from './App.vue'

function onMathJaxReady() {
    const el = document.getElementById("formulaDisplay");
    renderByMathjax(el);
}

initMathJax({}, onMathJaxReady);
const app = createApp(App)
app.use(MathJax)
app.mount('#app')




