<template>
  <div 
    class="modal-overlay"
    role="dialog" 
    aria-modal="true" 
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
    @click.self="handleCancel"
    @keydown.esc="handleCancel"
  >
    <div class="modal-content" ref="modalContent">
      <h2 id="modal-title" class="modal-title">{{ t('etl.datasetTitle') }}</h2>
      <p id="modal-description" class="modal-description">
        {{ t('etl.enterTitle') }}
      </p>
      
      <form @submit.prevent="submitTitle" novalidate>
        <div class="form-group">
          <label for="dataset-title" class="required">
            {{ t('etl.titleDataset') }}
          </label>
          <input 
            id="dataset-title"
            ref="titleInput"
            v-model="title" 
            type="text"
            class="title-input"
            :placeholder="t('etl.titlePlaceholder')"
            required
            minlength="3"
            :aria-invalid="hasError"
            aria-describedby="title-help title-error"
          />
          <div id="title-help" class="help-text">
            {{ t('etl.titleMinLength') }}
          </div>
          <div 
            v-if="hasError" 
            id="title-error" 
            class="error-message"
            role="alert"
          >
            {{ t('etl.titleRequiredError') }}
          </div>
        </div>
        
        <div class="modal-actions">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="!canSubmit"
          >
            {{ t('common.validate') }}
          </button>
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="handleCancel"
          >
            {{ t('common.cancel') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const title = ref('')
const attempted = ref(false)
const titleInput = ref(null)
const modalContent = ref(null)

const emit = defineEmits(['title-submitted', 'cancel'])

const canSubmit = computed(() => title.value.trim().length >= 3)
const hasError = computed(() => attempted.value && !canSubmit.value)

const submitTitle = () => {
  attempted.value = true
  if (canSubmit.value) {
    emit('title-submitted', title.value.trim())
  }
}

const handleCancel = () => {
  emit('cancel')
}

// Focus management
onMounted(async () => {
  await nextTick()
  titleInput.value?.focus()
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

// Trap focus dans la modal
const trapFocus = (e) => {
  if (e.key !== 'Tab') return
  
  const focusableElements = modalContent.value?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) || []
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (e.shiftKey && document.activeElement === firstElement) {
    lastElement?.focus()
    e.preventDefault()
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    firstElement?.focus()
    e.preventDefault()
  }
}

onMounted(() => {
  document.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7); display: flex;
  align-items: center; justify-content: center; z-index: 1000;
  padding: 1rem;
}
.modal-content {
  background: var(--color-bg-primary); border-radius: 8px;
  padding: 2rem; min-width: 400px; max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.modal-title {
  color: var(--color-text-primary); margin-bottom: 1rem;
  font-size: 1.5rem;
}
.modal-description {
  color: var(--color-text-secondary); margin-bottom: 1.5rem;
}
.title-input {
  width: 100%;
}
.help-text {
  font-size: 0.875rem; color: var(--color-text-secondary);
  margin-top: 0.25rem;
}
.modal-actions {
  display: flex; gap: 1rem; justify-content: flex-end;
  margin-top: 2rem;
}
</style>