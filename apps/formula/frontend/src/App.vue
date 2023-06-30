<script setup>
import {ref, watch} from 'vue'
import { MathJax } from 'mathjax-vue3'

import Footer from "./components/Footer.vue"
import Header from "./components/Header.vue"


const formula = ref("k=d^2");
const isBlock = ref(true);

watch(formula, ()=>{
  isBlock.value = formula.value.startsWith("$") && !formula.value.endsWith("$$") ? false : true;
})

</script>

<template>
    <div class="container m-auto p-5 md:py-10 md:px-20">
        <Header />
        <main>
            <textarea v-model="formula" id="formulaTextarea" class="textarea textarea-info w-full min-h-[10rem] mb-6 p-4"
                placeholder="请输入LaTex公式">
            </textarea>
            <div id="formulaDisplay" class="w-full bg-slate-300 min-h-[10rem] px-6 rounded-lg flex items-center justify-center">
              <math-jax :latex="formula.trim().replace(/^\$+|\$+$/g, '')" 
              :block="isBlock ? true : false" >
              </math-jax>
            </div>
        </main>
    </div>
  <Footer />
</template>


<style scoped lang="scss">

</style>
