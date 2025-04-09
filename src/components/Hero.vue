<script setup>
import Navbar from './Navbar.vue'

</script>

<template>
    <section class="min-h-screen ms-84 me-84 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex-col items-center">
        <div class="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
            <!-- Left: Text -->
            <div class="md:w-1/2 text-center md:text-left space-y-6">
            <h1 class="text-5xl font-extrabold text-gray-900">
                Welcome to <span class="text-yellow-600">Pandemetrix</span>
            </h1>
            <p class="text-lg text-white-600">
                Powerful insights and data at your fingertips. Let's build something incredible.
            </p>
            <div>
                <button class="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition">
                Get Started
                </button>
            </div>
            </div>
    
            <!-- Right: Optional Image -->
            <div class="md:w-1/2 mt-10 md:mt-0">
            <img src="https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg" alt="Hero Image" class="rounded-lg shadow-lg">
            </div>
        </div>
        <Navbar />
    </section>
</template>
  