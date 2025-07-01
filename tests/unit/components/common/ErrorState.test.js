import { mount } from '@vue/test-utils'
import ErrorState from '@/components/common/ErrorState.vue'

describe('ErrorState.vue', () => {
  test('renders with default props', () => {
    const wrapper = mount(ErrorState, {
      props: { message: 'Test error message' }
    })
    expect(wrapper.text()).toContain('Une erreur est survenue')
    expect(wrapper.text()).toContain('Test error message')
    wrapper.unmount()
  })

  test('renders with custom title', () => {
    const wrapper = mount(ErrorState, {
      props: {
        title: 'Custom Error',
        message: 'Custom message'
      }
    })
    expect(wrapper.text()).toContain('Custom Error')
    expect(wrapper.text()).toContain('Custom message')
    wrapper.unmount()
  })

  test('shows retry button when retryAction provided', () => {
    const retryFn = jest.fn()
    const wrapper = mount(ErrorState, {
      props: {
        message: 'Error',
        retryAction: retryFn
      }
    })
    expect(wrapper.find('.retry-button').exists()).toBe(true)
    wrapper.find('.retry-button').trigger('click')
    expect(retryFn).toHaveBeenCalled()
    wrapper.unmount()
  })

  test('hides retry button when no retryAction', () => {
    const wrapper = mount(ErrorState, {
      props: { message: 'Error' }
    })
    expect(wrapper.find('.retry-button').exists()).toBe(false)
    wrapper.unmount()
  })
})