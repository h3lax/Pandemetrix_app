import { mount } from '@vue/test-utils'
import Status from '@/components/Status.vue'
import { createTestI18n } from '../../helpers/i18n-helper'

jest.mock('@/services/dataServices', () => ({
  checkAppStatus: jest.fn().mockResolvedValue({ status: 'OK' }),
  checkDbStatus: jest.fn().mockResolvedValue({ database: 'Connected' })
}))

jest.mock('@/services/etlService', () => ({
  getCollections: jest.fn().mockResolvedValue({
    collections: [{ collection: 'test_data', count: 100 }]
  })
}))

describe('Status.vue', () => {
  test('renders page title', () => {
    const wrapper = mount(Status, {
      global: {
        plugins: [createTestI18n()]
      }
    })
    expect(wrapper.find('h1').text()).toBe('Statut du système')
    wrapper.unmount()
  })

  test('shows initial loading state', () => {
    const wrapper = mount(Status, {
      global: {
        plugins: [createTestI18n()]
      }
    })
    expect(wrapper.vm.loading).toBe(true)
    wrapper.unmount()
  })

  test('displays sections', () => {
    const wrapper = mount(Status, {
      global: {
        plugins: [createTestI18n()]
      }
    })
    expect(wrapper.find('.status-section').exists()).toBe(true)
    expect(wrapper.find('.data-section').exists()).toBe(true)
    wrapper.unmount()
  })
})