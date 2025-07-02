import { mount } from '@vue/test-utils'
import LoadingState from '@/components/common/LoadingState.vue'

describe('LoadingState.vue', () => {
  test('renders with default props', () => {
    const wrapper = mount(LoadingState)
    expect(wrapper.text()).toContain('Chargement en cours...')
    expect(wrapper.find('.spinner').exists()).toBe(true)
    wrapper.unmount()
  })

  test('renders with custom message', () => {
    const wrapper = mount(LoadingState, {
      props: { message: 'Custom loading...' }
    })
    expect(wrapper.text()).toContain('Custom loading...')
    wrapper.unmount()
  })

  test('has correct aria attributes', () => {
    const wrapper = mount(LoadingState, {
      props: { label: 'Custom loading label' }
    })
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Custom loading label"]').exists()).toBe(true)
    wrapper.unmount()
  })

  test('renders announce text for screen readers', () => {
    const wrapper = mount(LoadingState, {
      props: { announceText: 'Custom announce' }
    })
    expect(wrapper.text()).toContain('Custom announce')
    wrapper.unmount()
  })
})