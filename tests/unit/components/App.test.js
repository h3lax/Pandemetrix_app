import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
  test('renders header and router-view', () => {
    const wrapper = mount(App, {
      global: {
        stubs: ['Header', 'router-view']
      }
    })
    expect(wrapper.findComponent({ name: 'Header' }).exists()).toBe(true)
    expect(wrapper.find('router-view-stub').exists()).toBe(true)
  })

  test('initializes items array', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })
})