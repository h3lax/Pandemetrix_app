import { mount } from '@vue/test-utils'
import HeaderWhite from '@/components/header/HeaderWhite.vue'

describe('HeaderWhite.vue', () => {
  test('renders navigation links', () => {
    const wrapper = mount(HeaderWhite, {
      global: {
        stubs: ['router-link']
      }
    })
    expect(wrapper.text()).toContain('Pandemetrix')
    expect(wrapper.findAll('router-link-stub')).toHaveLength(6)
  })

  test('has correct header styling', () => {
    const wrapper = mount(HeaderWhite)
    expect(wrapper.find('header').classes()).toContain('bg-white')
    expect(wrapper.find('nav').exists()).toBe(true)
  })
})