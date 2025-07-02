describe('Dashboard Integration', () => {
  beforeEach(() => {
    // Mock de l'API de données avec fetch
    cy.intercept('GET', '**/api/data**', {
      statusCode: 200,
      body: [
        { date: '2024-01-01', country: 'France', new_cases: 1000, new_deaths: 20 },
        { date: '2024-01-02', country: 'Germany', new_cases: 800, new_deaths: 15 }
      ]
    }).as('covidData')

    cy.intercept('GET', '**/api/etl/collections', {
      statusCode: 200,
      body: { collections: [{ collection: 'ml_cases_deaths', count: 10000 }] }
    }).as('collections')
  })

  it('should load dashboard with real data', () => {
    cy.visit('/dashboard')
    cy.wait(['@covidData', '@collections'])
    
    // Vérifier les KPI
    cy.contains('Taux d\'infection').should('be.visible')
    cy.contains('Taux de mortalité').should('be.visible')
    
    // Vérifier les graphiques
    cy.get('canvas').should('have.length.at.least', 2)
    
    // Test changement de période
    cy.contains('7J').click()
    cy.wait('@covidData')
  })
})