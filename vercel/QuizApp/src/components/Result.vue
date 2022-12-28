<script setup>
import { RouterLink } from "vue-router"
const { results } = defineProps(['results'])
</script>

<template>
    <div class="results">
        <p>Your results...</p>
        <h1>
            {{ results }}
        </h1>
        <p>Back to <RouterLink active-class="active" to="/">Home</RouterLink>
        </p>
    </div>
</template>

<style scoped>
.results {
    text-align: center;
    padding: 100px 0;
}

p {
    font-size: 25px;
}

h1 {
    font-size: 80px;
}
</style>