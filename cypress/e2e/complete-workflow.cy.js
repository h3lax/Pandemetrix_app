describe('Complete Application Workflow', () => {
  beforeEach(() => {
    // Intercepter les appels API récurrents
    cy.intercept('GET', '**/api/health/status', { statusCode: 200, body: { status: 'OK' } })
    cy.intercept('GET', '**/api/health/db-check', { statusCode: 200, body: { database: 'Connected' } })
    cy.intercept('GET', '**/api/etl/collections', { 
      statusCode: 200, 
      body: { collections: [{ collection: 'test_data', count: 100 }] } 
    })
  })

  it('completes full user journey', () => {
    // 1. Page d'accueil
    cy.visit('/')
    cy.contains('Pandemetrix').should('be.visible')
    
    // 2. Navigation vers ETL
    cy.contains('Upload Dataset').click()
    cy.url().should('include', '/etl')
    
    // 3. Test upload fichier
    cy.get('.drop-zone').should('be.visible')
    cy.fixture('test-data.csv').then(fileContent => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: 'test-data.csv',
        mimeType: 'text/csv'
      }, { force: true })
    })
    
    // 4. Saisie du titre
    cy.get('.modal-content input').type('Test Dataset E2E')
    cy.contains('Valider').click()
    
    // 5. Vérification succès upload
    cy.contains('succès', { timeout: 10000 }).should('be.visible')
    
    // 6. Navigation Dashboard
    cy.contains('Dashboard').click()
    cy.contains('Dashboard Pandemetrix').should('be.visible')
    cy.get('canvas').should('be.visible')
    
    // 7. Test Analyse IA
    cy.contains('Analysis-IA').click()
    cy.get('#dataset-select').select('Cas quotidiens France')
    cy.get('#model-select').select('RandomForest')
    cy.contains('Lancer la prédiction').click()
    cy.contains('Prédiction en cours...').should('be.visible')
    
    // 8. Status check
    cy.contains('Status').click()
    cy.contains('✔️ Connecté').should('be.visible')
  })
})
