import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import de from './locales/de.json'
import it from './locales/it.json'

const savedLanguage = localStorage.getItem('pandemetrix-language') || 'fr'

export default createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'fr',
  messages: {
    fr,
    de,
    it
  }
})

export const supportedLocales = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' }
]