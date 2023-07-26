<script setup>

import { ref, onMounted } from "vue"
import { RouterLink, RouterView } from 'vue-router'
import GithubCorners from '@uivjs/vue-github-corners';

import axios from "axios";
axios.defaults.baseURL = process.env.BASE_URL
const endpoint = "/jokes/random?n=30"

import Nav from "./components/Nav.vue"
import Footer from "./components/Footer.vue"
import MasonryGrid from "./components/MasonryGrid.vue";
import { useLoadStore } from "./stores/load.js"

const items = ref([])
const load = useLoadStore()

const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.offsetHeight;

    if (scrollTop + windowHeight >= documentHeight - 1000 && load.isLoading === false) {
        onUpdateData(); // 当滚动到接近页面底部时加载更多数据
    }
};


const onRefreshData = async () => {
    console.log("Start Refreshing...")
    load.isLoading = true
    const response = await axios.get(endpoint);
    items.value = response.data.status === "ok" ? response.data.objects : [];
    load.isLoading = false
    console.log("Finish Refreshing...")
}

const onUpdateData = async () => {
    console.log("Start Updating...")
    load.isLoading = true;
    const response = await axios.get(endpoint);
    items.value = items.value.concat(response.data.status === "ok" ? response.data.objects : []);
    load.isLoading = false
    console.log("Finish Updating...")
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    onRefreshData()
})

</script>

<template>
    <div class="min-h-screen relative">
        <github-corners fixed target="__blank" href="https://github.com/HenryJi529/OpenMorningstar" />
        <Nav @refreshData="onRefreshData" />
        <div class="pb-20">
            <MasonryGrid :items="items" v-if="items.length > 0" />
            <div v-else class="flex justify-center items-center h-[80vh]">
                <span class="loading loading-infinity w-[5rem] md:w-[10rem]"></span>
            </div>
            <div class="flex justify-center items-center" v-if="load.isLoading && items.length > 0">
                <span class="loading loading-dots w-[3rem] md:w-[5rem]"></span>
            </div>
        </div>
        <Footer :fixed="!items" />
    </div>
</template>

<style scoped lang="scss"></style>
