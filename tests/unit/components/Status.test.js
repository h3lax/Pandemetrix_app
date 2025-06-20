import { mount } from '@vue/test-utils'
import Status from '@/components/Status.vue'

jest.mock('@/services/dataServices')
jest.mock('@/services/etlService')

describe('Status.vue', () => {
  test('renders title', () => {
    const wrapper = mount(Status)
    expect(wrapper.find('h1').text()).toBe('Feuille de données')
  })

  test('shows loading state initially', () => {
    const wrapper = mount(Status)
    expect(wrapper.text()).toContain('Chargement des données...')
  })

  test('displays API and DB status', async () => {
    const wrapper = mount(Status)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('API:')
    expect(wrapper.text()).toContain('DB:')
  })

  test('renders table when data available', async () => {
    const wrapper = mount(Status)
    wrapper.vm.data = [{ collection: 'test', count: 100 }]
    wrapper.vm.loading = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('table').exists()).toBe(true)
  })
})