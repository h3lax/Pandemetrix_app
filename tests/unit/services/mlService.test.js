import MLService from '@/services/mlService'

jest.mock('@/services/api', () => ({
  get: jest.fn(),
  post: jest.fn()
}))

import api from '@/services/api'

describe('MLService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('checkMLHealth returns health data', async () => {
    const mockHealth = { model_loaded: true, ready_for_predictions: true }
    api.get.mockResolvedValue({ data: mockHealth })

    const result = await MLService.checkMLHealth()
    expect(api.get).toHaveBeenCalledWith('/ml/health')
    expect(result).toEqual(mockHealth)
  })

  test('predict validates data and calls API', async () => {
    const mockPrediction = { prediction: { new_deaths_predicted: 42 } }
    api.post.mockResolvedValue({ data: mockPrediction })

    const predictionData = {
      country: 'France',
      date: '2023-01-15',
      new_cases: 1500,
      people_vaccinated: 50000000,
      new_tests: 100000,
      daily_occupancy_hosp: 2500
    }

    const result = await MLService.predict(predictionData)
    expect(api.post).toHaveBeenCalledWith('/ml/predict', predictionData)
    expect(result).toEqual(mockPrediction)
  })

  test('validatePredictionData throws error for missing fields', () => {
    expect(() => {
      MLService.validatePredictionData({})
    }).toThrow('Champs manquants')
  })

  test('generatePredictionData creates correct structure', () => {
    const predictions = MLService.generatePredictionData('France', '2023-01-01', 3)
    expect(predictions).toHaveLength(3)
    expect(predictions[0]).toHaveProperty('country', 'France')
    expect(predictions[0]).toHaveProperty('date')
    expect(predictions[0]).toHaveProperty('new_cases')
  })
})