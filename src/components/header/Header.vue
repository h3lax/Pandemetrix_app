<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NavItem from './NavItem.vue'
import Navbar from './Navbar.vue'
import LanguageSwitcher from '../common/LanguageSwitcher.vue'

const { t } = useI18n()

const props = defineProps({
  title: { type: String, default: null },
  subtitle: { type: String, default: null }
})

const appTitle = props.title || t('app.title')
const appSubtitle = props.subtitle || t('app.subtitle')
</script>

<template>
  <header role="banner" class="main-header">
    <div class="header-container">
      <div class="header-top">
        <div class="branding">
          <h1 class="site-title">{{ appTitle }}</h1>
          <p class="site-subtitle">{{ appSubtitle }}</p>
        </div>
        <div class="header-controls">
          <LanguageSwitcher />
        </div>
      </div>
      <Navbar />
    </div>
  </header>
</template>

<style scoped>
.main-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%);
  color: var(--color-bg-primary); padding: 2rem 1rem; min-height: 50vh;
  display: flex; align-items: center;
}
.header-container {
  max-width: 1200px; margin: 0 auto; width: 100%;
  display: flex; flex-direction: column; align-items: center; gap: 2rem;
}
.header-top {
  display: flex; justify-content: space-between; align-items: center;
  width: 100%; max-width: 1000px;
}
.branding { text-align: center; flex: 1; }
.site-title {
  font-size: clamp(2rem, 5vw, 4rem); font-weight: 800; margin-bottom: 0.5rem;
  color: var(--color-warning); text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}
.site-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem); opacity: 0.9;
  color: var(--color-warning);
}
.header-controls {
  display: flex; align-items: center; gap: 1rem;
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column; gap: 1.5rem;
  }
  .branding {
    order: 1;
  }
  .header-controls {
    order: 2;
  }
}
</style>