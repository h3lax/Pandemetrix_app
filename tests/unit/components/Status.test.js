import { mount } from '@vue/test-utils'
import Status from '@/components/Status.vue'

jest.mock('@/services/dataServices', () => ({
  checkAppStatus: jest.fn().mockResolvedValue({ status: 'OK' }),
  checkDbStatus: jest.fn().mockResolvedValue({ database: 'Connected' })
}))

jest.mock('@/services/etlService', () => ({
  getCollections: jest.fn().mockResolvedValue({
    collections: [
      { collection: 'test_data', count: 100 },
      { collection: 'covid19_data', count: 5000 }
    ]
  })
}))

describe('Status.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Status)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('renders page title', () => {
    expect(wrapper.find('h1').text()).toBe('Statut du système')
  })

  test('displays status sections', () => {
    expect(wrapper.find('.status-section').exists()).toBe(true)
    expect(wrapper.find('.data-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('État des services')
    expect(wrapper.text()).toContain('Collections de données')
  })

  test('shows loading state initially', () => {
    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  test('displays API and DB status after loading', async () => {
    wrapper.vm.apiStatus = true
    wrapper.vm.dbStatus = true
    wrapper.vm.loading = false
    wrapper.vm.data = [{ collection: 'test', count: 100 }]
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('✓ Connecté')
    expect(wrapper.find('.success').exists()).toBe(true)
  })

  test('renders table when data available', async () => {
    wrapper.vm.data = [
      { collection: 'test_data', count: 100 },
      { collection: 'covid19_data', count: 5000 }
    ]
    wrapper.vm.loading = false
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  test('handles sorting functionality', async () => {
    wrapper.vm.data = [
      { collection: 'b_data', count: 100 },
      { collection: 'a_data', count: 200 }
    ]
    wrapper.vm.loading = false
    
    await wrapper.vm.$nextTick()
    
    // Test sort by collection name
    wrapper.vm.sortBy('collection')
    expect(wrapper.vm.sortField).toBe('collection')
    expect(wrapper.vm.sortDirection).toBe('asc')
    
    // Test sort direction toggle
    wrapper.vm.sortBy('collection')
    expect(wrapper.vm.sortDirection).toBe('desc')
  })

  test('shows error state when API fails', async () => {
    wrapper.vm.apiStatus = false
    wrapper.vm.dbStatus = false
    wrapper.vm.error = 'API non disponible'
    wrapper.vm.loading = false
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('✗ Déconnecté')
    expect(wrapper.find('.error').exists()).toBe(true)
  })

  test('displays empty state when no collections', async () => {
    wrapper.vm.data = []
    wrapper.vm.loading = false
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('Aucune collection de données disponible')
  })
})