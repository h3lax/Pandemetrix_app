import { mount } from '@vue/test-utils'
import ChartTest from '@/components/dashboard/ChartTest.vue'

jest.mock('@/services/dataServices')

describe('ChartTest.vue', () => {
  test('renders Line component', () => {
    const wrapper = mount(ChartTest, {
      global: {
        stubs: ['Line']
      }
    })
    expect(wrapper.findComponent({ name: 'Line' }).exists()).toBe(true)
  })

  test('initializes chart data structure', () => {
    const wrapper = mount(ChartTest)
    expect(wrapper.vm.chartData.labels).toEqual([])
    expect(wrapper.vm.chartData.datasets).toHaveLength(1)
    expect(wrapper.vm.chartData.datasets[0].label).toBe('Cases Over Time')
  })
})