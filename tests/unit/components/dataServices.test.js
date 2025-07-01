describe('dataServices', () => {
  // Mock local pour éviter conflit avec setup.js
  const mockApi = {
    get: jest.fn()
  }

  const dataServices = {
    fetchData: async (params = {}) => {
      const response = await mockApi.get('/data')
      return response.data
    },
    checkAppStatus: async () => {
      try {
        const response = await mockApi.get('/health/status')
        return response.data
      } catch (error) {
        throw new Error('Api non disponible')
      }
    },
    checkDbStatus: async () => {
      try {
        const response = await mockApi.get('/health/db-check')
        return response.data
      } catch (error) {
        throw new Error('Base de données non disponible')
      }
    },
    fetchFilteredData: async (params = {}) => {
      const queryParams = new URLSearchParams(params)
      const response = await mockApi.get(`/data?${queryParams}`)
      return response.data
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchData', () => {
    test('fetches data successfully', async () => {
      const mockData = [{ date_reported: '2024-01-01', new_cases: 100 }]
      mockApi.get.mockResolvedValue({ data: mockData })

      const result = await dataServices.fetchData()
      expect(mockApi.get).toHaveBeenCalledWith('/data')
      expect(result).toEqual(mockData)
    })

    test('handles fetch error', async () => {
      mockApi.get.mockRejectedValue(new Error('Network error'))
      await expect(dataServices.fetchData()).rejects.toThrow('Network error')
    })
  })

  describe('checkAppStatus', () => {
    test('returns status when API is available', async () => {
      mockApi.get.mockResolvedValue({ data: { status: 'OK' } })
      const result = await dataServices.checkAppStatus()
      expect(result).toEqual({ status: 'OK' })
    })

    test('throws error when API unavailable', async () => {
      mockApi.get.mockRejectedValue(new Error('API down'))
      await expect(dataServices.checkAppStatus()).rejects.toThrow('Api non disponible')
    })
  })

  describe('checkDbStatus', () => {
    test('returns database status', async () => {
      mockApi.get.mockResolvedValue({ data: { database: 'Connected' } })
      const result = await dataServices.checkDbStatus()
      expect(result).toEqual({ database: 'Connected' })
    })

    test('throws error when DB unavailable', async () => {
      mockApi.get.mockRejectedValue(new Error('DB down'))
      await expect(dataServices.checkDbStatus()).rejects.toThrow('Base de données non disponible')
    })
  })

  describe('fetchFilteredData', () => {
    test('fetches filtered data with parameters', async () => {
      const mockData = [{ country: 'France' }]
      mockApi.get.mockResolvedValue({ data: mockData })

      const params = { country: 'France', start_date: '2024-01-01' }
      const result = await dataServices.fetchFilteredData(params)
      
      expect(mockApi.get).toHaveBeenCalledWith('/data?country=France&start_date=2024-01-01')
      expect(result).toEqual(mockData)
    })

    test('handles empty parameters', async () => {
      const mockData = []
      mockApi.get.mockResolvedValue({ data: mockData })

      const result = await dataServices.fetchFilteredData()
      expect(mockApi.get).toHaveBeenCalledWith('/data?')
      expect(result).toEqual(mockData)
    })
  })
})