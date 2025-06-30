import DashboardService from '@/services/dashboardService'

global.fetch = jest.fn()

describe('DashboardService', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  test('getCovidDataByPeriod fetches data correctly', async () => {
    const mockData = [
      { date: '2024-01-01', new_cases: 100, country: 'France' }
    ]
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const result = await DashboardService.getCovidDataByPeriod('30d', 1000)
    expect(fetch).toHaveBeenCalled()
    expect(result).toEqual(mockData)
  })

  test('calculateKPIs processes data correctly', () => {
    const testData = [
      { date_reported: '2024-01-01', new_cases: 100, new_deaths: 5 },
      { date_reported: '2024-01-02', new_cases: 150, new_deaths: 8 }
    ]

    const kpis = DashboardService.calculateKPIs(testData)
    expect(kpis).toHaveProperty('totalCases', 250)
    expect(kpis).toHaveProperty('totalDeaths', 13)
    expect(kpis).toHaveProperty('casesChange')
  })

  test('prepareChartData formats data for charts', () => {
    const testData = [
      { date_reported: '2024-01-01', new_cases: 100 },
      { date_reported: '2024-01-02', new_cases: 150 }
    ]

    const chartData = DashboardService.prepareChartData(testData)
    expect(chartData).toHaveProperty('labels')
    expect(chartData).toHaveProperty('data')
    expect(chartData.data).toEqual([100, 150])
  })
})