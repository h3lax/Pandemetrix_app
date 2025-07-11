import { mount } from '@vue/test-utils'
import TitleModal from '@/components/etl/TitleModal.vue'
import { createTestI18n } from '../../../helpers/i18n-helper'

describe('TitleModal.vue', () => {
  test('renders modal with title input', () => {
    const wrapper = mount(TitleModal, {
      global: {
        plugins: [createTestI18n()]
      }
    })
    expect(wrapper.find('#modal-title').text()).toBe('Titre du jeu de données')
    expect(wrapper.find('#dataset-title').exists()).toBe(true)
    wrapper.unmount()
  })

  test('validates title length', async () => {
    const wrapper = mount(TitleModal, {
      global: {
        plugins: [createTestI18n()]
      }
    })
    const input = wrapper.find('#dataset-title')
    
    await input.setValue('ab')
    expect(wrapper.vm.canSubmit).toBe(false)
    
    await input.setValue('abc')
    expect(wrapper.vm.canSubmit).toBe(true)
    wrapper.unmount()
  })

  test('emits title-submitted on valid form submission', async () => {
    const wrapper = mount(TitleModal, {
      global: {
        plugins: [createTestI18n()]
      }
    })
    await wrapper.find('#dataset-title').setValue('Test Dataset')
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.emitted('title-submitted')).toBeTruthy()
    expect(wrapper.emitted('title-submitted')[0]).toEqual(['Test Dataset'])
    wrapper.unmount()
  })

  test('emits cancel on cancel button', async () => {
    const wrapper = mount(TitleModal, {
      global: {
        plugins: [createTestI18n()]
      }
    })
    await wrapper.find('.btn-secondary').trigger('click')
    
    expect(wrapper.emitted('cancel')).toBeTruthy()
    wrapper.unmount()
  })

  test('shows error for invalid input', async () => {
    const wrapper = mount(TitleModal, {
      global: {
        plugins: [createTestI18n()]
      }
    })
    const form = wrapper.find('form')
    
    await form.trigger('submit')
    expect(wrapper.vm.hasError).toBe(true)
    expect(wrapper.find('.error-message').exists()).toBe(true)
    wrapper.unmount()
  })
})