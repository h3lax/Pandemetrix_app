<template>
  <div class="language-switcher">
    <button
      @click="toggleDropdown"
      @keydown.escape="closeDropdown"
      class="language-button"
      :aria-expanded="isOpen"
      :aria-label="$t('language.switch')"
      aria-haspopup="true"
    >
      <span class="current-flag">{{ currentLanguage.flag }}</span>
      <span class="current-code">{{ currentLanguage.code.toUpperCase() }}</span>
      <svg class="dropdown-icon" :class="{ 'rotate': isOpen }" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <transition name="dropdown">
      <ul
        v-if="isOpen"
        class="language-dropdown"
        role="menu"
        :aria-label="$t('language.switch')"
        ref="dropdown"
      >
        <li
          v-for="language in supportedLocales"
          :key="language.code"
          role="none"
        >
          <button
            @click="changeLanguage(language.code)"
            class="language-option"
            :class="{ 'active': language.code === currentLocale }"
            role="menuitem"
            :aria-current="language.code === currentLocale ? 'true' : 'false'"
          >
            <span class="flag">{{ language.flag }}</span>
            <span class="name">{{ language.name }}</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { supportedLocales } from '@/i18n'

const { locale } = useI18n()
const isOpen = ref(false)
const dropdown = ref(null)

const currentLocale = computed(() => locale.value)
const currentLanguage = computed(() => 
  supportedLocales.find(lang => lang.code === currentLocale.value) || supportedLocales[0]
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const changeLanguage = (langCode) => {
  locale.value = langCode
  localStorage.setItem('pandemetrix-language', langCode)
  document.documentElement.lang = langCode
  closeDropdown()
  
  // Annoncer le changement pour les lecteurs d'écran
  announceLanguageChange(langCode)
}

const announceLanguageChange = (langCode) => {
  const language = supportedLocales.find(l => l.code === langCode)
  const announcer = document.getElementById('announcements')
  if (announcer && language) {
    announcer.textContent = `Langue changée en ${language.name}`
    setTimeout(() => { announcer.textContent = '' }, 1000)
  }
}

// Fermer le dropdown en cliquant à l'extérieur
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target) && 
      !event.target.closest('.language-button')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.documentElement.lang = currentLocale.value
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: var(--color-bg-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-height: 44px;
}

.language-button:hover,
.language-button:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.current-flag {
  font-size: 1.2rem;
}

.current-code {
  font-size: 0.875rem;
  font-weight: 600;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
  min-width: 160px;
  z-index: 1000;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: left;
  color: var(--color-text-primary);
}

.language-option:hover,
.language-option:focus {
  background: var(--color-bg-secondary);
}

.language-option.active {
  background: var(--color-primary);
  color: var(--color-bg-primary);
}

.language-option .flag {
  font-size: 1.1rem;
}

.language-option .name {
  font-weight: 500;
}

/* Animations */
.dropdown-enter-active {
  transition: all 0.2s ease;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* Media queries */
@media (max-width: 768px) {
  .language-dropdown {
    right: -1rem;
    left: -1rem;
  }
}
</style>