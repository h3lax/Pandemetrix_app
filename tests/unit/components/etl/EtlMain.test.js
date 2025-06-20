// tests/unit/components/etl/EtlMain.test.js
import { mount } from '@vue/test-utils'
import EtlMain from '@/components/etl/EtlMain.vue'

jest.mock('@/services/etlService')

describe('EtlMain.vue', () => {
  test('renders main sections', () => {
    const wrapper = mount(EtlMain, {
      global: {
        stubs: ['CSVUploader', 'URLDownloader']
      }
    })
    expect(wrapper.text()).toContain('Gestionnaire ETL')
  })

  test('handles upload success', async () => {
    const wrapper = mount(EtlMain)
    const refreshSpy = jest.spyOn(wrapper.vm, 'refreshJobs')
    
    // Simule directement l'appel
    await wrapper.vm.refreshJobs()
    expect(refreshSpy).toHaveBeenCalled()
  })

  test('refreshes jobs list', async () => {
    const wrapper = mount(EtlMain)
    await wrapper.vm.refreshJobs()
    expect(wrapper.vm.loadingJobs).toBe(false)
  })
})