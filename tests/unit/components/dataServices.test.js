import { fetchData, checkAppStatus, checkDbStatus } from '../../../src/services/dataServices'

// Mock API
jest.mock('../../../src/services/api', () => ({
  get: jest.fn()
}))

import {api} from '../../../src/services/api'

describe('dataServices', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchData', () => {
    test('fetches data successfully', async () => {
      const mockData = [{ date_reported: '2024-01-01', new_cases: 100 }]
      api.get.mockResolvedValue({ data: mockData })

      const result = await fetchData()
      expect(api.get).toHaveBeenCalledWith('/data')
      expect(result).toEqual(mockData)
    })

    test('handles fetch error', async () => {
      api.get.mockRejectedValue(new Error('Network error'))
      
      await expect(fetchData()).rejects.toThrow('Network error')
    })
  })

  describe('checkAppStatus', () => {
    test('returns status when API is available', async () => {
      api.get.mockResolvedValue({ data: { status: 'OK' } })
      
      const result = await checkAppStatus()
      expect(result).toEqual({ status: 'OK' })
    })

    test('throws error when API unavailable', async () => {
      api.get.mockRejectedValue(new Error('API down'))
      
      await expect(checkAppStatus()).rejects.toThrow('Api non disponible')
    })
  })
})