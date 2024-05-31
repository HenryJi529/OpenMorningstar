<script setup>
import {onMounted, ref } from "vue"

import axios from "axios";
import Cookies from "js-cookie"

import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"

const selectedImage = ref(null);
const selectedModelName = ref("NiceViTB16");
const imageDataURL = ref(null);
const category = ref("");
const score = ref(0);
const isLoading = ref(false);

onMounted(async()=> {
  await axios.get('csrf-token/')
  axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken');
})

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();

    reader.onload = () => {
      selectedImage.value = selectedFile;
      imageDataURL.value = reader.result;
    };

    reader.readAsDataURL(selectedFile);
  }
}

const clearImage = (event) => {
  selectedImage.value = null;
  imageDataURL.value = null;
  event.target.files = null;
}

const uploadImage = async () => {
  isLoading.value = true
  const response = await axios.post("/", {
    "imageDataURL": imageDataURL.value,
    "modelName": selectedModelName.value
  })

  if (response.status === 200) {
    category.value = response.data.category
    score.value = response.data.score
  }
  isLoading.value = false

}

</script>


<template>
  <Header />

  <main class="flex justify-center items-center flex-col space-y-6 w-80 mx-auto mt-[2em] mb:mt-[4em] pb-[6em]">
    <select class="select w-full max-w-xs" v-model="selectedModelName">
      <option disabled>请选择模型</option>
      <option selected>NiceViTB16</option>
      <option>EfficientNetB2</option>
      <option>GoogLeNet</option>
      <option>TinyVGG</option>
    </select>

    <input class="file-input file-input-bordered file-input-primary w-full max-w-xs" accept="image/*" type="file"
      @change="handleFileChange" />

    <div class="flex justify-between items-center w-full my-3 md:pb-10">
      <button class="btn btn-outline px-5 text-lg" @click="clearImage">清 除</button>
      <button class="btn btn-outline px-5 text-lg btn-primary" @click="uploadImage" :disabled="!selectedImage">
        <span class="loading loading-spinner loading-sm" v-if="isLoading"></span>
        <span v-else>上传</span>
      </button>
    </div>
    <div class="flex justify-center items-center">
      <img v-if="selectedImage" :src="imageDataURL" alt="Selected Image">
    </div>

    <div class="alert alert-info pt-4" v-if="category">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span><span class="font-bold">预测结果</span>: {{ category }}({{ `${(score * 100).toFixed(1)}%` }})</span>
    </div>

  </main>

  <Footer />
</template>


<style scoped></style>
