describe('Performance Tests', () => {
  it('loads pages within acceptable time', () => {
    const startTime = Date.now()
    cy.visit('/')
    cy.contains('Pandemetrix').should('be.visible')
    cy.then(() => {
      const loadTime = Date.now() - startTime
      expect(loadTime).to.be.lessThan(3000) // 3 secondes max
    })
  })

  it('handles large file uploads', () => {
    cy.visit('/etl')
    // Simuler un gros fichier
    const largeContent = 'date,cases\n'.repeat(10000)
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(largeContent),
      fileName: 'large-test.csv',
      mimeType: 'text/csv'
    }, { force: true })
    
    cy.get('.modal-content input').type('Large Dataset')
    cy.contains('Valider').click()
    cy.contains('Upload en cours...').should('be.visible')
  })
})