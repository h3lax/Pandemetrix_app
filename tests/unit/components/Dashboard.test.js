import { mount } from '@vue/test-utils'
import Dashboard from '../../../src/components/dashboard/Dashboard.vue'

// Mock Chart.js
jest.mock('chart.js/auto', () => ({
  Chart: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
    render: jest.fn()
  })),
  registerables: []
}))

describe('Dashboard.vue', () => {
  test('renders dashboard component', () => {
    const wrapper = mount(Dashboard, {
      global: {
        stubs: ['router-link']
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })
})