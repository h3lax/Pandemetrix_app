<script setup>
    import { ref } from 'vue'
    import NavItem from './NavItem.vue';
    import Navbar from './Navbar.vue';

    const props = defineProps({
        title: {
            type: String,
            default: 'Pandemetrix'
        },
        subtitle: {
            type: String,
            default: 'pandemic predictive model'
        }
    })
</script>

<template>
    <header class="min-h-[60dvh] bg-gradient-to-r from-purple-600 to-indigo-600 py-8 flex flex-col">
        <div class="w-full h-full pt-40 mx-auto px-4 shrink grow basis-auto flex flex-auto flex-col justify-between justify-items-center items-center">
            <div class="mt-8">
                <div class="text-7xl font-extrabold bg-gradient-to-r from-orange-600 to-yellow-400 inline-block text-transparent bg-clip-text">{{ title }}</div>
                <p class="text-xl text-center mt-2 bg-gradient-to-r from-orange-600 to-yellow-400 text-transparent bg-clip-text">{{ subtitle }}</p>
            </div>
            
            <Navbar />
           

        </div>

    </header>
</template>