<script setup>
import { onMounted, ref } from "vue";

import axios from "axios";
axios.defaults.baseURL = process.env.BASE_URL
const endpoint = "/joke/images/random?n=1"

const imageUrl = ref("")
const showLoading = ref(true)

onMounted(async () => {
    const response = await axios.get(endpoint);
    imageUrl.value = response.status === 200 ? response.data.objects[0].link : "";
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
