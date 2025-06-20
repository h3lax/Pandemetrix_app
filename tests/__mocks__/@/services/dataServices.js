export const fetchData = jest.fn().mockResolvedValue([
  { date_reported: '2024-01-01', new_cases: 100 },
  { date_reported: '2024-01-02', new_cases: 150 }
])

export const checkAppStatus = jest.fn().mockResolvedValue({ status: 'OK' })
export const checkDbStatus = jest.fn().mockResolvedValue({ database: 'Connected' })