import { mount } from '@vue/test-utils'
import Dashboard from '../../../src/components/dashboard/Dashboard.vue'

// Mock des services
jest.mock('@/services/dataServices', () => ({
  fetchData: jest.fn().mockResolvedValue([
    { date_reported: '2024-01-01', new_cases: 100 }
  ])
}))

jest.mock('vue-chartjs', () => ({
  Line: {
    name: 'MockLineChart',
    template: '<div class="mock-chart"></div>',
    props: ['data', 'options']
  }
}))

describe('Dashboard.vue', () => {
  test('renders dashboard component', () => {
    const wrapper = mount(Dashboard, {
      global: {
        stubs: {
          Line: {
            template: '<div class="mock-chart"></div>'
          }
        }
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h1').text()).toContain('Dashboard Pandemetrix')
  })
})