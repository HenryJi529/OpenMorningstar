<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Footer from './components/Footer.vue'
</script>

<template>
    <div class="w-screen h-screen fixed flex justify-between flex-col" style="height: -webkit-fill-available;">
        <div class="flex flex-col items-center justify-center space-y-12 py-20">
            <div class="text-5xl mt-20">
                链接分享
            </div>
            <RouterView />
        </div>
        <Footer />
    </div>
</template>

<style scoped>
</style>
