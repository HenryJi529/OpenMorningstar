<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="container">
        <Transition name="router">
            <RouterView />
        </Transition>
    </div>
</template>

<style scoped>
.container {
    max-width: 1000px;
    margin: 0 auto;
}

.router-enter-from {
    opacity: 0;
    transform: translateX(100px);
}

.router-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.router-enter-active {
    transition: all 0.5s ease;
}
</style>