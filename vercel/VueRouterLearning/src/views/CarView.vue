<script setup>
import { useRoute, useRouter, RouterView } from 'vue-router'
import cars from '../data/cars.json'
// import ContactView from './ContactView.vue'

const route = useRoute()
const router = useRouter()
const carId = route.params.id
const car = cars.find(car => car.id === parseInt(route.params.id))
</script>

<template>
    <div v-if="car">
        <h1>Car View</h1>
        <p>{{ car.name }}</p>
        <p>{{ car.year }}</p>
        <p>{{ car.price }}</p>
        <button @click="router.push(`/cars/${route.params.id}/contact`)">Click for Contact</button>
        <!-- <ContactView /> -->
        <RouterView />
    </div>
    <div v-else>Car not found</div>
</template>