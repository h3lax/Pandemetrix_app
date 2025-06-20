import { mount } from '@vue/test-utils'
import FileUploader from '@/components/etl/FileUploader.vue'

describe('FileUploader.vue', () => {
  test('renders upload form', () => {
    const wrapper = mount(FileUploader)
    expect(wrapper.find('h2').text()).toBe('Upload de CSV')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  test('validates required fields', async () => {
    const wrapper = mount(FileUploader)
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  test('handles file selection', async () => {
    const wrapper = mount(FileUploader)
    const file = new File(['test'], 'test.csv', { type: 'text/csv' })
    const input = wrapper.find('input[type="file"]')
    
    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: false
    })
    await input.trigger('change')
    expect(wrapper.vm.file).toBeTruthy()
  })
})
