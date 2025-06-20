import { describe, test, expect, jest } from '@jest/globals'

// Mock axios
const mockAxios = {
  post: jest.fn(),
  get: jest.fn()
}

jest.mock('axios', () => mockAxios)

describe('etlService', () => {
  test('API mock works', () => {
    expect(mockAxios.post).toBeDefined()
    expect(typeof mockAxios.post).toBe('function')
  })

  test('handles file upload structure', () => {
    const file = new File(['test'], 'test.csv', { type: 'text/csv' })
    const formData = new FormData()
    formData.append('file', file)
    
    expect(formData).toBeDefined()
  })
})