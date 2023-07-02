<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <div class=" md:mx-auto relative bg-white overflow-hidden border-b">
    <div class="h-12 md:ml-10 md:pr-4 md:space-x-8 flex justify-center">
      <a href="#" class="font-medium text-gray-500 hover:text-gray-900 flex items-center">Home</a>
      <a href="#" class="font-medium text-gray-500 hover:text-gray-900 flex items-center">Product</a>
      <a href="#" class="font-medium text-gray-500 hover:text-gray-900 flex items-center">Article</a>
      <a href="#" class="font-medium text-gray-500 hover:text-gray-900 flex items-center">About</a>
      <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 flex items-center">Log in</a>
    </div>
  </div>

  <RouterView />
</template>

<style scoped lang="scss">

</style>
