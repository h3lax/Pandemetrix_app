<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    name: { type: String, required: true },
    to: { type: String, required: true }
})
</script>

<template>
    <router-link class="nav-item" :to="{ name: to }">{{ name }}</router-link>
</template>

<style scoped>
.nav-item {
    display: inline-block;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    text-decoration: none;
    color: var(--color-bg-primary);
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid transparent;
    transition: all 0.3s ease;
    font-weight: 500;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-item:focus {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
    background: rgba(255, 255, 255, 0.25);
}

.nav-item.router-link-active {
    background: rgba(255, 255, 255, 0.3);
    font-weight: bold;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
</style>