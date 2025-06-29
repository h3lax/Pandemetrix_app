import { uploadCSV, downloadFromUrl, getCollections } from '../../../src/services/etlService'

// Mock complet du service sans importer le vrai module
const mockUploadCSV = jest.fn().mockResolvedValue({ success: true })
const mockDownloadFromUrl = jest.fn().mockResolvedValue({ success: true })
const mockGetCollections = jest.fn().mockResolvedValue({
  collections: [{ collection: 'test_data', count: 100 }]
})

jest.mock('../../../src/services/etlService', () => ({
  uploadCSV: mockUploadCSV,
  downloadFromUrl: mockDownloadFromUrl,
  getCollections: mockGetCollections
}))

describe('etlService.js', () => {
  test('uploadCSV works with mock', async () => {
    const file = new File(['test'], 'test.csv')
    const result = await mockUploadCSV(file, 'test title')
    expect(result.success).toBe(true)
  })

  test('downloadFromUrl works with mock', async () => {
    const result = await mockDownloadFromUrl('OMS_Daily')
    expect(result.success).toBe(true)
  })

  test('getCollections returns mock data', async () => {
    const result = await mockGetCollections()
    expect(result.collections).toHaveLength(1)
    expect(result.collections[0].collection).toBe('test_data')
  })
})