import { mount } from '@vue/test-utils'
import Header from '../../../src/components/header/Header.vue'
import { createTestI18n } from '../../helpers/i18n-helper'

describe('Header.vue', () => {
  test('renders default title and subtitle', () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [createTestI18n()],
        stubs: ['NavItem', 'Navbar', 'LanguageSwitcher']
      }
    })
    expect(wrapper.find('h1').text()).toContain('Pandemetrix')
    expect(wrapper.text()).toContain('modèle prédictif de pandémies')
  })

  test('renders custom props', () => {
    const wrapper = mount(Header, {
      props: {
        title: 'Custom Title',
        subtitle: 'Custom Subtitle'
      },
      global: {
        plugins: [createTestI18n()],
        stubs: ['NavItem', 'Navbar', 'LanguageSwitcher']
      }
    })
    expect(wrapper.text()).toContain('Custom Title')
    expect(wrapper.text()).toContain('Custom Subtitle')
  })
})