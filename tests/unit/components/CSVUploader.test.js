import { mount } from '@vue/test-utils'
import CSVUploader from '../../../src/components/etl/CSVUploader.vue'

// Mock du service
jest.mock('@/services/etlService', () => ({
  uploadCSV: jest.fn().mockResolvedValue({ success: true })
}))

describe('CSVUploader.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CSVUploader, {
      global: {
        stubs: {
          TitleModal: {
            template: '<div class="mock-title-modal"></div>',
            emits: ['title-submitted', 'cancel']
          }
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('renders component', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.drop-zone').exists()).toBe(true)
  })

  test('shows correct default state', () => {
    expect(wrapper.find('.default-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('Glissez votre fichier CSV ici')
  })

  test('handles drag over events', async () => {
    const dropZone = wrapper.find('.drop-zone')
    
    await dropZone.trigger('dragover')
    expect(wrapper.vm.isDragOver).toBe(true)
    
    await dropZone.trigger('dragleave')
    expect(wrapper.vm.isDragOver).toBe(false)
  })

  test('triggers file input on click', async () => {
    const dropZone = wrapper.find('.drop-zone')
    const fileInput = wrapper.find('input[type="file"]')
    
    // Mock click method
    const clickSpy = jest.spyOn(fileInput.element, 'click')
    fileInput.element.click = jest.fn()
    
    await dropZone.trigger('click')
    expect(fileInput.element.click).toHaveBeenCalled()
  })
})