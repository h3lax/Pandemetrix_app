import { mount } from '@vue/test-utils'
import About from '@/components/About.vue'

describe('About.vue', () => {
  test('renders about content', () => {
    const wrapper = mount(About)
    expect(wrapper.text()).toContain('À propos de Pandemetrix')
    expect(wrapper.text()).toContain('modèle prédictif')
    expect(wrapper.text()).toContain('Vue.js')
  })

  test('has correct styling classes', () => {
    const wrapper = mount(About)
    expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    expect(wrapper.find('.bg-gradient-to-r').exists()).toBe(true)
  })
})