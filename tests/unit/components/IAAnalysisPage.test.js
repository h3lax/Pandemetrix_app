import { mount } from '@vue/test-utils'
import IAAnalysisPage from '../../../src/components/IAAnalysisPage.vue'

// Mock MLService avec données complètes
jest.mock('@/services/mlService', () => ({
  __esModule: true,
  default: {
    checkMLHealth: jest.fn().mockResolvedValue({
      model_loaded: true,
      ready_for_predictions: true,
      model_version: '1.0'
    }),
    getSupportedCountries: jest.fn().mockResolvedValue({
      countries: ['France', 'Germany'],
      total_countries: 2
    }),
    getModelInfo: jest.fn().mockResolvedValue({
      algorithm: 'polynomial_regression_with_ridge',
      training_date: '2024-01-01T00:00:00Z',
      performance: { test_r2: 0.824 }
    }),
    predict: jest.fn().mockResolvedValue({
      prediction: {
        new_deaths_predicted: 42.5,
        new_deaths_rounded: 43,
        country: 'France',
        date: '2022-05-15',
        confidence: 'Based on historical data patterns'
      },
      input_data: {
        new_cases: 1500,
        people_vaccinated: 50000000,
        new_tests: 100000,
        daily_occupancy_hosp: 2500
      },
      model_info: {
        version: '1.0',
        r2_score: 0.824,
        mae: 45.44
      },
      timestamp: '2024-01-01T12:00:00Z'
    }),
    validatePredictionData: jest.fn().mockReturnValue(true)
  }
}))

describe('IAAnalysisPage.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(IAAnalysisPage)
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  test('renders page title', () => {
    expect(wrapper.find('h1').text()).toBe('Analyse IA / Modèles de Prédictions')
  })

  test('loads ML components', async () => {
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(wrapper.vm.mlHealth).toBeTruthy()
    expect(wrapper.vm.supportedCountries).toContain('France')
  })

  test('validates prediction form', () => {
    // Setup état complet
    wrapper.vm.mlHealth = { ready_for_predictions: true }
    wrapper.vm.selectedCountry = 'France'
    wrapper.vm.predictionDate = '2022-05-15'
    wrapper.vm.inputData = {
      new_cases: 1500,
      people_vaccinated: 50000000,
      new_tests: 100000,
      daily_occupancy_hosp: 2500
    }
    
    expect(wrapper.vm.canPredict).toBe(true)
  })

  test('validates date range correctly', () => {
    // Date valide
    wrapper.vm.predictionDate = '2022-01-15'
    wrapper.vm.validateDate()
    expect(wrapper.vm.dateError).toBe('')
    
    // Date invalide (trop ancienne)
    wrapper.vm.predictionDate = '2019-01-01'
    wrapper.vm.validateDate()
    expect(wrapper.vm.dateError).toContain('Date doit être entre')
  })
})