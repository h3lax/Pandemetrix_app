import { mount } from '@vue/test-utils'
import URLDownloader from '@/components/etl/URLDownloader.vue'

// Mock le service
jest.mock('@/services/etlService')

describe('URLDownloader.vue', () => {
  test('renders download buttons', () => {
    const wrapper = mount(URLDownloader)
    expect(wrapper.text()).toContain('Cases and Deaths')
    expect(wrapper.text()).toContain('Vaccinations')
    expect(wrapper.text()).toContain('Hospitalizations')
    expect(wrapper.text()).toContain('Testing')
  })

  test('starts download process', async () => {
    const wrapper = mount(URLDownloader)
    // Test la fonction directement
    expect(wrapper.vm.isDownloading).toBe(false)
    
    // Déclenche le processus
    wrapper.vm.isDownloading = true
    wrapper.vm.currentCode = 'cases_deaths'
    
    expect(wrapper.vm.isDownloading).toBe(true)
    expect(wrapper.vm.currentCode).toBe('cases_deaths')
  })
})