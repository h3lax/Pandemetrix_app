<script setup>
    import { defineProps } from 'vue'
    const props = defineProps({
        name: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        }
    })
</script>

<template>
    <router-link class="px-3 py-1 rounded hover:bg-gray-200 text-base" :to="{ name: to }">{{ name }}</router-link>
</template>