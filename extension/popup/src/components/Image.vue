<script setup>
import { onMounted, ref } from "vue";

import axios from "axios";
axios.defaults.baseURL = process.env.BASE_URL
const endpoint = "/joke/images/random?n=1"

const imageUrl = ref("")

onMounted(async () => {
    const response = await axios.get(endpoint);
    imageUrl.value = response.data.status==="ok" ? response.data.objects[0].link : "";
})

</script>

<template>
  <main class="w-96">
    <img :src="imageUrl" v-if="imageUrl" class="w-full">
  </main>
</template>
