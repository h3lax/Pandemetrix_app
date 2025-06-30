import { mount } from '@vue/test-utils'
import Dashboard from '../../../src/components/dashboard/Dashboard.vue'

// Mock Chart.js
jest.mock('chart.js/auto', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
    render: jest.fn(),
    resize: jest.fn()
  }))
}))

// Mock Plotly
Object.defineProperty(window, 'Plotly', {
  value: {
    newPlot: jest.fn().mockResolvedValue(true),
    restyle: jest.fn().mockResolvedValue(true),
    relayout: jest.fn().mockResolvedValue(true)
  }
})

// Mock des services
jest.mock('@/services/etlService', () => ({
  getCollections: jest.fn().mockResolvedValue({
    collections: [{ collection: 'test_data', count: 100 }]
  })
}))

jest.mock('@/services/dashboardService', () => ({
  __esModule: true,
  default: {
    getCovidDataByPeriod: jest.fn().mockResolvedValue([
      { date: '2024-01-01', new_cases: 100, new_deaths: 5, country: 'France' },
      { date: '2024-01-02', new_cases: 120, new_deaths: 3, country: 'France' }
    ])
  }
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

  test('displays KPI cards structure', () => {
    expect(wrapper.find('.kpi-cards').exists()).toBe(true)
    expect(wrapper.findAll('.kpi-card')).toHaveLength(3)
    expect(wrapper.text()).toContain('Taux d\'infection')
    expect(wrapper.text()).toContain('Taux de mortalité')
    expect(wrapper.text()).toContain('Taux de guérison')
  })

  test('renders charts section with period controls', () => {
    expect(wrapper.find('.charts-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('Évolution temporelle')
    expect(wrapper.findAll('.period-btn')).toHaveLength(4)
  })

  test('period buttons change selected period', async () => {
    const buttons = wrapper.findAll('.period-btn')
    expect(buttons[1].classes()).toContain('active') // 30J par défaut
    
    await buttons[0].trigger('click')
    expect(wrapper.vm.selectedPeriod).toBe('7d')
  })

  test('renders insights section with cards', () => {
    const insights = wrapper.findAll('.insight-card')
    expect(insights).toHaveLength(3)
    expect(wrapper.text()).toContain('Région la plus touchée')
    expect(wrapper.text()).toContain('Tendance hebdomadaire')
    expect(wrapper.text()).toContain('Total pays suivis')
  })

  test('renders data section for collections', () => {
    expect(wrapper.find('.data-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('Collections de données')
  })

  test('has chart canvas elements', () => {
    expect(wrapper.find('canvas[ref="casesChart"]').exists()).toBe(true)
    expect(wrapper.find('canvas[ref="mortalityChart"]').exists()).toBe(true)
  })

  test('initializes with correct default values', () => {
    expect(wrapper.vm.selectedPeriod).toBe('30d')
    expect(wrapper.vm.loading).toBe(true) // Initialement en chargement
    expect(wrapper.vm.timePeriods).toHaveLength(4)
  })
})