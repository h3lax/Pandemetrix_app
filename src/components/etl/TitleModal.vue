<template>
    <div class="modal-overlay">
      <div class="modal-content text-black">
        <h3>Donnez un titre à votre jeu de données</h3>
        <input class="m-8 rounded-ml p-2 border rounded-md border-blue-600" v-model="title" placeholder="Ex: Données mai 2025" />
        <div class="actions">
          <button class="text-white" @click="submitTitle">Valider</button>
          <button class="text-white" @click="$emit('cancel')">Annuler</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const title = ref('')
  const emit = defineEmits(['title-submitted', 'cancel'])
  
  const submitTitle = () => {
    const trimmed = title.value.trim()
    if (!trimmed) return
    emit('title-submitted', trimmed)
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
  }
  .modal-content {
    background: white;
    padding: 2em;
    border-radius: 8px;
    min-width: 320px;
  }
  .actions {
    margin-top: 1em;
    display: flex;
    gap: 1em;
    justify-content: center;
  }
  </style>
  