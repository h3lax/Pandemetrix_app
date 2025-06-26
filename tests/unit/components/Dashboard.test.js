import { mount } from '@vue/test-utils'
import Dashboard from '../../../src/components/dashboard/Dashboard.vue'

// Mock Plotly
jest.mock('plotly', () => ({
  newPlot: jest.fn().mockResolvedValue(true),
  restyle: jest.fn().mockResolvedValue(true),
  relayout: jest.fn().mockResolvedValue(true)
}))

// Mock des services
jest.mock('@/services/dataServices', () => ({
  fetchData: jest.fn().mockResolvedValue([
    { date_reported: '2024-01-01', new_cases: 100 }
  ])
}))

describe('Dashboard.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Dashboard, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('renders dashboard component', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h1').text()).toContain('PANDEMETRIX ANALYTICS')
  })

  test('displays KPI cards with default values', () => {
    expect(wrapper.text()).toContain('2.4%')
    expect(wrapper.text()).toContain('Taux d\'infection')
    expect(wrapper.text()).toContain('1.2%')
    expect(wrapper.text()).toContain('Taux de mortalité')
    expect(wrapper.text()).toContain('96.4%')
    expect(wrapper.text()).toContain('Taux de guérison')
  })

  test('renders map section', () => {
    expect(wrapper.find('.map-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('Répartition mondiale')
  })

  test('renders charts section with controls', () => {
    expect(wrapper.find('.charts-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('Évolution temporelle')
    expect(wrapper.findAll('.period-btn')).toHaveLength(4)
  })

  test('period buttons are interactive', async () => {
    const buttons = wrapper.findAll('.period-btn')
    expect(buttons[0].text()).toBe('7J')
    expect(buttons[1].text()).toBe('30J')
    expect(buttons[3].text()).toBe('1A')
    
    // Test du bouton actif par défaut
    expect(buttons[1].classes()).toContain('active')
    
    // Test du changement de période
    await buttons[0].trigger('click')
    expect(wrapper.vm.selectedPeriod).toBe('7d')
  })

  test('renders insights section', () => {
    const insights = wrapper.findAll('.insight-card')
    expect(insights).toHaveLength(3)
    expect(wrapper.text()).toContain('Île-de-France')
    expect(wrapper.text()).toContain('+12.4%')
    expect(wrapper.text()).toContain('94.2%')
  })

  test('renders accessibility table', () => {
    expect(wrapper.find('.chart-data-table').exists()).toBe(true)
    expect(wrapper.find('table').exists()).toBe(true)
  })

  test('has correct chart references', () => {
    expect(wrapper.vm.worldMap).toBeDefined()
    expect(wrapper.vm.casesChart).toBeDefined()
    expect(wrapper.vm.mortalityChart).toBeDefined()
  })

  test('initializes with correct period data', () => {
    expect(wrapper.vm.selectedPeriod).toBe('30d')
    expect(wrapper.vm.timePeriods).toHaveLength(4)
    expect(wrapper.vm.chartData.labels).toContain('Jan')
  })
})