<script setup>
import { ref } from "vue"
let count = ref(0);

const increment = () => {
  count.value = count.value + 1;
};

const decrement = () => {
  count.value = count.value - 1;
};

</script>

<template>
  <main>
    <div>
      <h4>The Current Count is...</h4>
      <h1>{{ count }}</h1>
      <button @click="decrement()"> - </button>
      <button @click="increment()"> + </button>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aliceblue;
  width: 100vw;
  height: 100vh;
}

div {
  text-align: center;
}
</style>