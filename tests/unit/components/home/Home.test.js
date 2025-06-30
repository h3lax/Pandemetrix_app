import { mount } from '@vue/test-utils'
import Home from '@/components/home/Home.vue'

describe('Home.vue', () => {
  test('renders home items', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: ['Hero']
      }
    })
    expect(wrapper.findAllComponents({ name: 'Hero' })).toHaveLength(6)
  })

  test('initializes items with correct structure', () => {
    const wrapper = mount(Home)
    expect(wrapper.vm.items).toHaveLength(6)
    expect(wrapper.vm.items[0]).toHaveProperty('title')
    expect(wrapper.vm.items[0]).toHaveProperty('route')
    expect(wrapper.vm.items[0]).toHaveProperty('gradiant')
  })
})