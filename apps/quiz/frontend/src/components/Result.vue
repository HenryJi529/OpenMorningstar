<script setup>
import { RouterLink } from "vue-router"
import { NWatermark } from 'naive-ui'

const { results } = defineProps(['results'])
</script>

<template>
    <Transition name="fade" appear>
        <div class="results">
            <p>Your results...</p>
            <n-watermark content="核心机密" cross fullscreen selectable :font-size="16" :line-height="16" :width="192"
                :height="128" :x-offset="12" :y-offset="28" :rotate="-15">
            </n-watermark>
            <h1>{{ results }}</h1>
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