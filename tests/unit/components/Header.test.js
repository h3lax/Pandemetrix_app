import { mount } from '@vue/test-utils'
import Header from '../../../src/components/header/Header.vue'

describe('Header.vue', () => {
  test('renders default title and subtitle', () => {
    const wrapper = mount(Header)
    expect(wrapper.text()).toContain('Pandemetrix')
    expect(wrapper.text()).toContain('pandemic predictive model')
  })

  test('renders custom props', () => {
    const wrapper = mount(Header, {
      props: {
        title: 'Custom Title',
        subtitle: 'Custom Subtitle'
      }
    })
    expect(wrapper.text()).toContain('Custom Title')
    expect(wrapper.text()).toContain('Custom Subtitle')
  })
})