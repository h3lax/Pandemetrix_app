export const uploadCSV = jest.fn().mockResolvedValue({ 
  success: true, 
  message: 'Upload successful' 
})

export const downloadFromUrl = jest.fn().mockResolvedValue({
  success: true,
  message: 'Download successful'
})

export const getCollections = jest.fn().mockResolvedValue({
  collections: [
    { collection: 'test_data', count: 100 }
  ]
})

export const getETLJobs = jest.fn().mockResolvedValue([
  {
    id: 1,
    filename: 'test.csv',
    type: 'upload',
    status: 'completed',
    created_at: '2024-01-01T00:00:00Z'
  }
])

export const deleteETLJob = jest.fn().mockResolvedValue({ success: true })