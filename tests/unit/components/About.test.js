import { mount } from '@vue/test-utils'
import About from '@/components/About.vue'
import { createTestI18n } from '../../helpers/i18n-helper'

describe('About.vue', () => {
  test('renders about content', () => {
    const wrapper = mount(About, {
      global: {
        plugins: [createTestI18n()]
      }
    })
    expect(wrapper.text()).toContain('À propos de Pandemetrix')
    expect(wrapper.text()).toContain('modèle prédictif')
    expect(wrapper.text()).toContain('technologies modernes')
  })

  test('has correct styling classes', () => {
    const wrapper = mount(About, {
      global: {
        plugins: [createTestI18n()]
      }
    })
    expect(wrapper.find('.about-page').exists()).toBe(true)
  })
})