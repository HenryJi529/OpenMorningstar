<script setup>
import { ref, onMounted } from 'vue';
import {useLoadStore} from "../stores/load.js"

const host = process.env.BASE_URL.split('/').slice(0, 3).join('/')

const load = useLoadStore()
const props = defineProps(['items']);

</script>

<template>

<masonry-wall :items="props.items" :padding="16">
    <template #default="{ item, index }">
        <div class="border-solid border-slate-300 border-8 rounded-2xl m-2">
            <div v-if="item.type==='photo'">
                <img :src="item.link.startsWith('http') ? item.link : host + item.link" class="w-full object-fill">
            </div>
            <div v-else class="p-4 py-8">
                <p>{{ item.body }}</p>
            </div>
        </div>
    </template>
</masonry-wall>


</template>