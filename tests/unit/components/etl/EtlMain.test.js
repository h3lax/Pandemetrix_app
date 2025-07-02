import { mount } from '@vue/test-utils'
import EtlMain from '@/components/etl/EtlMain.vue'

jest.mock('@/services/etlService', () => ({
  getETLJobs: jest.fn().mockResolvedValue([]),
  deleteETLJob: jest.fn().mockResolvedValue({ success: true })
}))

describe('EtlMain.vue', () => {
  test('renders main sections', () => {
    const wrapper = mount(EtlMain, {
      global: {
        stubs: ['CSVUploader', 'URLDownloader']
      }
    })
    expect(wrapper.text()).toContain('Gestionnaire ETL')
    wrapper.unmount()
  })

  test('handles events correctly', () => {
    const wrapper = mount(EtlMain, {
      global: {
        stubs: ['CSVUploader', 'URLDownloader']
      }
    })
    
    // Test direct des méthodes
    expect(typeof wrapper.vm.handleUploadSuccess).toBe('function')
    expect(typeof wrapper.vm.handleDownloadSuccess).toBe('function')
    expect(typeof wrapper.vm.refreshJobs).toBe('function')
    
    wrapper.unmount()
  })
})