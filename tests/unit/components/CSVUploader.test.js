import { mount } from '@vue/test-utils'
import CSVUploader from '../../../src/components/etl/CSVUploader.vue'

describe('CSVUploader.vue', () => {
  test('renders component with drop zone', () => {
    const wrapper = mount(CSVUploader, {
      global: {
        stubs: {
          TitleModal: true
        }
      }
    })
    expect(wrapper.find('.drop-zone').exists()).toBe(true)
    expect(wrapper.text()).toContain('CSV')
  })

  test('has correct initial state', () => {
    const wrapper = mount(CSVUploader, {
      global: {
        stubs: {
          TitleModal: true
        }
      }
    })
    expect(wrapper.vm.isUploading).toBe(false)
    expect(wrapper.vm.uploadSuccess).toBe(false)
    expect(wrapper.vm.uploadError).toBe(false)
  })
})

describe('CSVUploader.vue - Additional Coverage', () => {
  test('handles drag over and leave events', async () => {
    const wrapper = mount(CSVUploader, {
      global: { stubs: { TitleModal: true } }
    })
    
    const dropZone = wrapper.find('.drop-zone')
    await dropZone.trigger('dragover')
    expect(wrapper.vm.isDragOver).toBe(true)
    
    await dropZone.trigger('dragleave')
    expect(wrapper.vm.isDragOver).toBe(false)
    wrapper.unmount()
  })

  test('validates file type and size', async () => {
    const wrapper = mount(CSVUploader, {
      global: { stubs: { TitleModal: true } }
    })
    
    // Test file validation
    const badFile = new File(['content'], 'test.txt', { type: 'text/plain' })
    await wrapper.vm.handleFile(badFile)
    
    expect(wrapper.vm.uploadError).toBe(true)
    expect(wrapper.vm.errorMessage).toContain('CSV')
    wrapper.unmount()
  })

  test('handles keyboard navigation', async () => {
    const wrapper = mount(CSVUploader, {
      global: { stubs: { TitleModal: true } }
    })
    
    const dropZone = wrapper.find('.drop-zone')
    
    // Test space key
    await dropZone.trigger('keydown', { key: ' ', preventDefault: jest.fn() })
    
    // Vérifier que l'input file est accessible
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    wrapper.unmount()
  })

  test('resets upload state correctly', () => {
    const wrapper = mount(CSVUploader, {
      global: { stubs: { TitleModal: true } }
    })
    
    wrapper.vm.uploadedFile = { name: 'test.csv' }
    wrapper.vm.uploadSuccess = true
    wrapper.vm.resetUpload()
    
    expect(wrapper.vm.uploadedFile).toBeNull()
    expect(wrapper.vm.uploadSuccess).toBe(false)
    wrapper.unmount()
  })

  test('shows correct states', async () => {
    const wrapper = mount(CSVUploader, {
      global: { stubs: { TitleModal: true } }
    })
    
    // Test uploading state
    wrapper.vm.isUploading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.uploading-state').exists()).toBe(true)
    
    // Test success state
    wrapper.vm.isUploading = false
    wrapper.vm.uploadSuccess = true
    wrapper.vm.uploadedFile = { name: 'test.csv' }
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.success-state').exists()).toBe(true)
    
    wrapper.unmount()
  })
})