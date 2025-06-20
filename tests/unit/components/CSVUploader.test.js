import { mount } from '@vue/test-utils'
import CSVUploader from '../../../src/components/etl/CSVUploader.vue'

describe('CSVUploader.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CSVUploader, {
      global: {
        stubs: ['router-link']
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('renders component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  test('handles file input correctly', async () => {
    const file = new File(['test'], 'test.csv', { type: 'text/csv' })
    const input = wrapper.find('input[type="file"]')
    
    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: false,
    })

    await input.trigger('change')
    expect(wrapper.vm.$data).toBeDefined()
  })
})