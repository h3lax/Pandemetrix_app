describe('API Integration Tests', () => {
  beforeEach(() => {
    cy.mockAllAPIs()
  })

  it('should handle API health checks', () => {
    cy.visit('/datasheet')
    
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
    
    // Intercepter avec une réponse qui simule un modèle non prêt
    cy.intercept('GET', '**/api/v1/covid/health', {
      statusCode: 200,
      body: { 
        model_loaded: false,
        ready_for_predictions: false,
        model_version: null 
      }
    }).as('mlHealth')
    
    cy.wait('@mlHealth')
    cy.contains('Le modèle ML n\'est pas disponible').should('be.visible')
  })
})