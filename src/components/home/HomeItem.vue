<script setup>

    const props = defineProps({
        to: {
            type: String,
            default: 'Accueil'
        },
        title: {
            type: String,
            default: 'Pandemetrix'
        },
        subtitle: {
            type: String,
            default: 'pandemic predictive model'
        },
        gradiant: {
            type: String,
            default: 'bg-gradient-to-r from-purple-600 to-indigo-600'
        }
    })
</script>

<template>
    <router-link :to="{ name: to }">
        <div 
            class="w-auto min-h-[10dvh]  py-8 flex flex-col hover:opacity-60"
            :class="gradiant"
        >
            <div class="w-full h-full mx-auto px-4 shrink grow basis-auto flex flex-auto flex-col justify-between justify-items-center items-center">
                <div class="mt-6 flex flex-col items-center gap">
                    <div class="text-7xl font-extrabold text-white">{{ title }}</div>
                    <p class="text-xl text-center mt-3 text-white">{{ subtitle }}</p>
                </div>         
            </div>

        </div>
    </router-link>
</template>