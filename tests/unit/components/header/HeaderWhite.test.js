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
    wrapper.unmount()
  })

  test('has correct header structure', () => {
    const wrapper = mount(HeaderWhite)
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('header').classes()).toContain('bg-white')
    wrapper.unmount()
  })

  test('renders brand and navigation', () => {
    const wrapper = mount(HeaderWhite, {
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
            props: ['to']
          }
        }
      }
    })
    expect(wrapper.text()).toContain('Pandemetrix')
    expect(wrapper.text()).toContain('Accueil')
    expect(wrapper.text()).toContain('À propos')
    expect(wrapper.text()).toContain('Dashboard')
    wrapper.unmount()
  })

  test('has fixed positioning', () => {
    const wrapper = mount(HeaderWhite)
    expect(wrapper.find('header').classes()).toContain('fixed')
    expect(wrapper.find('header').classes()).toContain('z-10')
    wrapper.unmount()
  })
})