<script setup>
import { useRoute } from 'vue-router'
import cars from '../data/cars.json'
const route = useRoute()
const contact = cars.find(car => car.id === parseInt(route.params.id)).contact
</script>

<template>
    <div>
        <h1>Contact Info</h1>
        <p>{{ contact.dealer }}</p>
        <p>{{ contact.number }}</p>
    </div>
</template>