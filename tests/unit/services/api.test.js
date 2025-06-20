describe('api.js', () => {
  test('api mock works', () => {
    const api = require('@/services/api').default
    expect(api.get).toBeDefined()
    expect(api.post).toBeDefined()
  })
})