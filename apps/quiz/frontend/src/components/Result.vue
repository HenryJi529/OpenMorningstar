<script setup>
import { RouterLink } from "vue-router"
const { results } = defineProps(['results'])
</script>

<template>
    <Transition name="fade" appear>
        <div class="results">
            <p>Your results...</p>
            <h1>
                {{ results }}
            </h1>
            <p>Back to <RouterLink active-class="active" to="/">Home</RouterLink>
            </p>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
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

.fade-enter-from {
    opacity: 0;
}

.fade-enter-to {
    opacity: 1;
}

.fade-enter-active {
    transition: all 2s ease;
}
</style>