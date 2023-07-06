<script setup>
import {ref} from 'vue'
import axios from 'axios';
import {useRoute} from 'vue-router'
const baseURL = process.env.BASE_URL
axios.defaults.baseURL = baseURL


const route = useRoute()
const currentPath = ref(window.location.href)


const endpoint = "/submit/"

const url = ref("")  // NOTE: 提交的信息
const link = ref("") // NOTE: 返回的加密链接


const handleSubmit = async ()=>{
  if(url.value.length > 1000 || url.value.startsWith("http") == false){
    alert("链接不合法")
    return
  }

  const { data: { csrfToken } } = await axios.get('csrf-token/')
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
  const response = await axios.post(endpoint,{
    "url": url.value,
  })

  if(response.status === 200){
    link.value = response.data.link
    url.value = ""
  }

}

</script>

<template>
  <div class="form-control" v-if="!link">
    <div class="input-group">
        <input v-model="url" type="text" name="url" placeholder="添加链接..."
            class="input input-bordered w-[20rem] md:w-[32rem] lg:w-[40rem]" />
        <button type="submit" class="btn btn-square" @click="handleSubmit">GO</button>
    </div>
  </div>
  <div v-else>
    <div class="md:text-2xl my-10 text-center">
      <i class="fa-solid fa-link"></i>
      <a :href="`${currentPath}${link}`" class="text-lime-600 break-words">{{ currentPath + link }}</a>
    </div>
    <div class="flex justify-center">
        <img :src="`${baseURL}qrcode/`" alt="链接二维码" class="h-[8rem] md:h-[16rem]">
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
