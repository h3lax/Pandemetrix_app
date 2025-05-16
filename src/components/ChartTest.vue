<template>
    <div>
      <Line :data="chartData" />
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue'
    import { fetchData } from '@/services/dataServices'
    import { Line } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
    
    ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
    
    const chartData = ref({
        labels: [],
        datasets: [
        {
            label: 'Cases Over Time',
            backgroundColor: '#42A5F5',
            borderColor: '#42A5F5',
            data: []
        }
        ]
    })
  
    onMounted(async () => {
        try {
        const data = await fetchData()
        chartData.value.labels = data.map(d => d.date_reported)
        chartData.value.datasets[0].data = data.map(d => d.new_cases)
        } catch (error) {
        console.error('Error fetching data:', error)
        }
    })
</script>
  
<style scoped>
  canvas {
    max-width: 100%;
  }
</style>
  