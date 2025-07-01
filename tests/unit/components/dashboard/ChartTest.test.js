import { mount } from '@vue/test-utils'
import ChartTest from '@/components/dashboard/ChartTest.vue'

// Mock complet de vue-chartjs
jest.mock('vue-chartjs', () => ({
  Line: {
    name: 'Line',
    template: '<div class="mock-line-chart"></div>',
    props: ['data', 'options']
  }
}))

jest.mock('@/services/dataServices', () => ({
  fetchData: jest.fn().mockResolvedValue([
    { date_reported: '2024-01-01', new_cases: 100 }
  ])
}))

describe('ChartTest.vue', () => {
  test('renders without canvas errors', () => {
    const wrapper = mount(ChartTest, {
      global: {
        stubs: {
          Line: {
            template: '<div class="mock-chart">Chart</div>'
          }
        }
      }
    })
    expect(wrapper.find('.mock-chart').exists()).toBe(true)
    wrapper.unmount()
  })

  test('initializes chart data structure', () => {
    const wrapper = mount(ChartTest, {
      global: {
        stubs: {
          Line: { template: '<div></div>' }
        }
      }
    })
    expect(wrapper.vm.chartData.labels).toEqual([])
    expect(wrapper.vm.chartData.datasets).toHaveLength(1)
    wrapper.unmount()
  })
})