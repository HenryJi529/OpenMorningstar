<script setup>
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import axios from 'axios';

const route = useRoute()
const endpoint = `/route/${route.params.id}/`
const url = ref("")
const errorMessage = ref("")

onMounted(async ()=>{
    const response = await axios.get(endpoint)
    if(response.status===200){
        url.value = response.data.url
    }
    else{
        errorMessage.value = response.data.message
    }
})

</script>


<template>
    <main class="mt-10 w-[20rem] md:w-[32rem] lg:w-[40rem] mx-auto my-10 text-center">
        <div class="text-2xl text-red-500 mb-10" v-if="url">
            建议复制到浏览器打开哦～
        </div>
        <div class="text-3xl text-red-500 mb-10">
            {{ errorMessage }}
        </div>
        <div class="max-w-[100vw] text-xl md:text-3xl">
            <a :href="url" class="link break-words" target="_blank" >
                {{ url }}
            </a>
        </div>
    </main>
</template>

