describe('API Integration Tests', () => {
  it('should handle API health checks', () => {
    cy.visit('/datasheet')
    
    // Intercepter les appels API
    cy.intercept('GET', '**/api/health/status').as('healthCheck')
    cy.intercept('GET', '**/api/health/db-check').as('dbCheck')
    
    // Attendre les appels
    cy.wait('@healthCheck')
    cy.wait('@dbCheck')
    
    // Vérifier les statuts
    cy.contains('✔️ Connecté').should('be.visible')
  })

  it('should handle API errors gracefully', () => {
    // Simuler une erreur API
    cy.intercept('GET', '**/api/etl/collections', {
      statusCode: 500,
      body: { error: 'Server Error' }
    }).as('apiError')
    
    cy.visit('/datasheet')
    cy.wait('@apiError')
    
    // Vérifier la gestion d'erreur
    cy.contains('Erreur').should('be.visible')
  })
})