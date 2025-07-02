describe('API Integration Tests', () => {
  it('should handle API health checks', () => {
    cy.visit('/datasheet')
    
    // Mock des endpoints de santé
    cy.intercept('GET', '**/api/health/status', {
      statusCode: 200,
      body: { status: 'OK' }
    }).as('healthCheck')
    
    cy.intercept('GET', '**/api/health/db-check', {
      statusCode: 200,
      body: { database: 'Connected' }
    }).as('dbCheck')
    
    cy.intercept('GET', '**/api/etl/collections', {
      statusCode: 200,
      body: { 
        collections: [
          { collection: 'test_data', count: 100 },
          { collection: 'ml_cases_deaths', count: 5000 }
        ] 
      }
    }).as('collections')
    
    cy.wait(['@healthCheck', '@dbCheck', '@collections'])
    cy.contains('✓ Connecté').should('be.visible')
  })

  it('should handle ML API proxy correctly', () => {
    cy.visit('/analyse-ia')
    
    // Test du proxy ML
    cy.intercept('GET', '**/api/ml/health', {
      statusCode: 503,
      body: { error: 'Pandemetrix_ML API non accessible' }
    }).as('mlDown')
    
    cy.wait('@mlDown')
    cy.contains('⚠️ Modèle non disponible').should('be.visible')
  })
})