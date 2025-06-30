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