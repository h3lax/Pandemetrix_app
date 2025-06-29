import { mount } from '@vue/test-utils'
import IAAnalysisPage from '../../../src/components/IAAnalysisPage.vue'

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

// Mock MLService
jest.mock('@/services/mlService', () => ({
  __esModule: true,
  default: {
    checkMLHealth: jest.fn().mockResolvedValue({
      model_loaded: true,
      ready_for_predictions: true,
      model_version: '1.0'
    }),
    getSupportedCountries: jest.fn().mockResolvedValue({
      countries: ['France', 'Germany', 'Italy']
    }),
    getModelInfo: jest.fn().mockResolvedValue({
      name: 'COVID-19 Deaths Prediction Model',
      version: '1.0',
      algorithm: 'polynomial_regression_with_ridge',
      training_date: '2024-01-01',
      countries_count: 44,
      features_used: ['date', 'new_cases'],
      performance: {
        test_r2: 0.824,
        test_mae: 45.44,
        improvement_r2_percent: 25.2
      }
    }),
    predict: jest.fn().mockResolvedValue({
      prediction: {
        new_deaths_predicted: 42.5,
        new_deaths_rounded: 43,
        country: 'France',
        date: '2023-01-15',
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
    })
  }
}))

describe('IAAnalysisPage.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(IAAnalysisPage)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('renders page title', () => {
    expect(wrapper.find('h1').text()).toBe('Analyse IA / Modèles de Prédictions')
  })

  test('displays prediction form when model is ready', async () => {
    // Attendre que les données se chargent
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    
    expect(wrapper.find('#country-select').exists()).toBe(true)
    expect(wrapper.find('#prediction-date').exists()).toBe(true)
    expect(wrapper.find('#new-cases').exists()).toBe(true)
    expect(wrapper.find('#people-vaccinated').exists()).toBe(true)
  })

  test('shows model status', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.ml-status').exists()).toBe(true)
    expect(wrapper.text()).toContain('Modèle prêt')
  })

  test('prediction form validates required fields', () => {
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)
    
    const inputs = wrapper.findAll('input[required]')
    expect(inputs.length).toBeGreaterThan(0)
  })

  test('displays model information section', async () => {
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Informations du modèle IA')
    expect(wrapper.text()).toContain('Performance du modèle')
  })

  test('handles prediction submission', async () => {
    // Simuler un modèle chargé
    wrapper.vm.mlHealth = { ready_for_predictions: true, model_version: '1.0' }
    wrapper.vm.supportedCountries = ['France']
    wrapper.vm.selectedCountry = 'France'
    wrapper.vm.predictionDate = '2023-01-15'
    wrapper.vm.inputData = {
      new_cases: 1500,
      people_vaccinated: 50000000,
      new_tests: 100000,
      daily_occupancy_hosp: 2500
    }
    
    await wrapper.vm.$nextTick()
    
    await wrapper.vm.runPrediction()
    
    expect(wrapper.vm.predictionResult).toBeTruthy()
    expect(wrapper.vm.loadingPrediction).toBe(false)
  })

  test('shows loading state during prediction', async () => {
    wrapper.vm.loadingPrediction = true
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Prédiction en cours...')
  })
})