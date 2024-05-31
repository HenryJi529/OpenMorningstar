<script setup>
import { onMounted, ref } from "vue";

import axios from "axios";
const endpoint = "/joke/photos/?n=1"

const host = process.env.BASE_URL.split('/').slice(0, 3).join('/')
const imageUrl = ref("")
const showLoading = ref(true)

onMounted(async () => {
    const response = await axios.get(endpoint);
    imageUrl.value = response.status === 200 ? response.data[0].link : "";
    imageUrl.value = imageUrl.value.startsWith('http') ? imageUrl.value : host + imageUrl.value;
})

</script>

<template>
  <main class="w-96 relative">
    <img :src="imageUrl" v-if="imageUrl" class="w-full" @load="showLoading = !showLoading">
    <div v-if="showLoading" class="absolute top-0 z-10">
      <div class="h-96 w-96 flex justify-center items-center">
        <span class="loading loading-dots loading-lg"></span>
      </div>
    </div>
  </main>
</template>
