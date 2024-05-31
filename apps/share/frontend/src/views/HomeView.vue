<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios';
import {useRoute} from 'vue-router'
import Cookies from 'js-cookie'

const route = useRoute()
const currentPath = ref(window.location.href)

const endpoint = "/submit/"

const url = ref("")  // NOTE: 提交的信息
const link = ref("") // NOTE: 返回的加密链接

onMounted(async()=> {
  await axios.get('csrf-token/')
  axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken');
})

const handleSubmit = async ()=>{
  if(url.value.length > 1000 || url.value.startsWith("http") == false){
    alert("链接不合法")
    return
  }

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
  <div v-else class="max-w-[100vw] overflow-hidden p-4">
    <div class="text-base md:text-2xl my-10 text-lime-600 break-words">
      <a :href="`${currentPath}${link}`">
        {{ currentPath + link }}
      </a>
    </div>
    <div class="flex justify-center">
        <img :src="`${baseURL}qrcode/`" alt="链接二维码" class="h-[8rem] md:h-[16rem]">
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
