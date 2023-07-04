<script setup>
import { ref } from 'vue'

import NoticeModal from "./NoticeModal.vue"
import CommandButton from "./CommandButton.vue"
import {useLoadStore} from "../stores/load.js"
const emit = defineEmits(['refreshData'])

const emitRefreshData = () => {
    emit("refreshData")
}
const load = useLoadStore()

</script>

<template>
    <main class="pt-6 pb-4 flex justify-center items-end">
        <CommandButton title="刷新" @click="emitRefreshData">
            <font-awesome-icon icon="fa-solid fa-rotate" :class="{'text-green-500':true, 'animate-spin': load.isLoading}" />
        </CommandButton>
        <span class="text-5xl">神兔笑话</span>
        <CommandButton title="问答">
            <NoticeModal />
        </CommandButton>
    </main>
</template>