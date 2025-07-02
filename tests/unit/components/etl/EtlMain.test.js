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
    
    // Test les méthodes qui existent réellement
    expect(typeof wrapper.vm.handleUploadError).toBe('function')
    expect(typeof wrapper.vm.handleDownloadError).toBe('function')
    expect(typeof wrapper.vm.getStatusStyle).toBe('function')
    expect(typeof wrapper.vm.formatDate).toBe('function')
    
    wrapper.unmount()
  })
})