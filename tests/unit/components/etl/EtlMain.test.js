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
    expect(wrapper.text()).toContain('Upload CSV')
    expect(wrapper.text()).toContain('Jobs ETL')
  })

  test('handles upload and download events', async () => {
    const wrapper = mount(EtlMain)
    const refreshSpy = jest.spyOn(wrapper.vm, 'refreshJobs').mockImplementation()
    
    await wrapper.vm.handleUploadSuccess()
    expect(refreshSpy).toHaveBeenCalled()
    
    await wrapper.vm.handleDownloadSuccess()
    expect(refreshSpy).toHaveBeenCalledTimes(2)
  })
})