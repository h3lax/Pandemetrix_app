const mockDashboardService = {
  getCovidDataByPeriod: jest.fn().mockResolvedValue([
    { date: '2024-01-01', new_cases: 100, country: 'France' }
  ]),
  calculateKPIs: jest.fn().mockReturnValue({
    totalCases: 250,
    totalDeaths: 13,
    casesChange: 5.2
  }),
  prepareChartData: jest.fn().mockReturnValue({
    labels: ['01/01', '02/01'],
    data: [100, 150]
  })
}

jest.mock('@/services/dashboardService', () => ({
  __esModule: true,
  default: mockDashboardService
}))

describe('DashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getCovidDataByPeriod fetches data correctly', async () => {
    const result = await mockDashboardService.getCovidDataByPeriod('30d', 1000)
    expect(result).toEqual([{ date: '2024-01-01', new_cases: 100, country: 'France' }])
  })

  test('calculateKPIs processes data correctly', () => {
    const result = mockDashboardService.calculateKPIs([])
    expect(result).toHaveProperty('totalCases', 250)
    expect(result).toHaveProperty('totalDeaths', 13)
  })

  test('prepareChartData formats data for charts', () => {
    const result = mockDashboardService.prepareChartData([])
    expect(result).toHaveProperty('labels')
    expect(result).toHaveProperty('data')
  })
})