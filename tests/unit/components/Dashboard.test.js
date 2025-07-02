import { mount } from '@vue/test-utils'
import Dashboard from '../../../src/components/dashboard/Dashboard.vue'

jest.mock('@/services/etlService', () => ({
  getCollections: jest.fn().mockResolvedValue({
    collections: [{ collection: 'test_data', count: 100 }]
  })
}))

jest.mock('@/services/dashboardService', () => ({
  __esModule: true,
  default: {
    getCovidDataByPeriod: jest.fn().mockResolvedValue([
      { date: '2024-01-01', new_cases: 100, country: 'France' }
    ])
  }
}))

describe('Dashboard.vue', () => {
  test('renders dashboard title', () => {
    const wrapper = mount(Dashboard, {
      global: {
        stubs: { 'router-link': true }
      }
    })
    expect(wrapper.find('h1').text()).toContain('PANDEMETRIX ANALYTICS')
    wrapper.unmount()
  })

  test('displays KPI structure', () => {
    const wrapper = mount(Dashboard, {
      global: {
        stubs: { 'router-link': true }
      }
    })
    expect(wrapper.find('.kpi-cards').exists()).toBe(true)
    expect(wrapper.findAll('.kpi-card')).toHaveLength(3)
    wrapper.unmount()
  })

  test('initializes with correct defaults', () => {
    const wrapper = mount(Dashboard, {
      global: {
        stubs: { 'router-link': true }
      }
    })
    expect(wrapper.vm.selectedPeriod).toBe('30d')
    expect(wrapper.vm.timePeriods).toHaveLength(4)
    wrapper.unmount()
  })
})