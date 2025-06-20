import { uploadCSV, downloadFromUrl, getCollections } from '@/services/etlService'

// Le mock est déjà dans tests/__mocks__/@/services/etlService.js
jest.mock('@/services/etlService')

describe('etlService.js', () => {
  test('uploadCSV works with mock', async () => {
    const file = new File(['test'], 'test.csv')
    const result = await uploadCSV(file, 'test title')
    expect(result.success).toBe(true)
  })

  test('downloadFromUrl works with mock', async () => {
    const result = await downloadFromUrl('OMS_Daily')
    expect(result.success).toBe(true)
  })

  test('getCollections returns mock data', async () => {
    const result = await getCollections()
    expect(result.collections).toHaveLength(1)
    expect(result.collections[0].collection).toBe('test_data')
  })
})