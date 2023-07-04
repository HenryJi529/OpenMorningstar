<script setup>
const props = defineProps(['title'])
</script>

<template>
    <div :title="props.title"
        class="btn btn-sm btn-circle rounded-full border-2 text-xl flex justify-center items-center bg-gray-200">
        <slot></slot>
    </div>
</template>