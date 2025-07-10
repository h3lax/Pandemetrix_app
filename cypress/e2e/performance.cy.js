describe('Performance Tests', () => {
  beforeEach(() => {
    cy.mockAllAPIs()
  })

  it('loads pages within acceptable time', () => {
    const startTime = Date.now()
    cy.visit('/')
    cy.contains('Pandemetrix').should('be.visible')
    cy.then(() => {
      const loadTime = Date.now() - startTime
      expect(loadTime).to.be.lessThan(3000)
    })
  })

})