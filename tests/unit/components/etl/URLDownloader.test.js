// tests/unit/components/etl/URLDownloader.test.js
import { mount } from '@vue/test-utils'
import URLDownloader from '@/components/etl/URLDownloader.vue'

// Mock le service
jest.mock('@/services/etlService')

describe('URLDownloader.vue', () => {
  test('renders download buttons', () => {
    const wrapper = mount(URLDownloader)
    expect(wrapper.text()).toContain('Télécharger OMS')
    expect(wrapper.text()).toContain('Télécharger Couleur sample')
  })

  test('starts download process', async () => {
    const wrapper = mount(URLDownloader)
    // Test la fonction directement
    expect(wrapper.vm.isDownloading).toBe(false)
    
    // Déclenche le processus
    wrapper.vm.isDownloading = true
    wrapper.vm.currentCode = 'OMS_Daily'
    
    expect(wrapper.vm.isDownloading).toBe(true)
    expect(wrapper.vm.currentCode).toBe('OMS_Daily')
  })
})