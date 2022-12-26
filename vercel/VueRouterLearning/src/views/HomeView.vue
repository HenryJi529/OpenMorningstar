<script setup>
import q from '../data/cars.json'
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router';

const cars = ref(q)
</script>

<template>
    <div>
        <h1>Home View</h1>
        <div class="cars">
            <RouterLink :to="`/cars/${car.id}/`" v-for="car in cars" :key="car.id">
                {{ car.name }}
            </RouterLink>
        </div>
    </div>
</template>


<style scoped>
.cars {
    display: flex;
    gap: 10px;
}

.cars a {
    text-decoration: none;
    color: black;
    width: 100px;
}
</style>