describe('ETL Workflow Complete', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should complete CSV upload workflow', () => {
    // Navigation vers ETL
    cy.contains('Upload Dataset').click()
    cy.url().should('include', '/etl')

    // Upload de fichier
    cy.get('.drop-zone').should('be.visible')
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-data.csv', { force: true })
    
    // Saisie du titre dans la modal
    cy.get('.modal-content').should('be.visible')
    cy.get('input[placeholder*="Données"]').type('Test Dataset E2E')
    cy.contains('Valider').click()

    // Vérification du succès
    cy.contains('succès').should('be.visible')
    cy.get('.file-card').should('contain', 'test-data.csv')
  })

  it('should download from URL successfully', () => {
    cy.visit('/etl')
    
    // Test téléchargement OMS
    cy.contains('Télécharger OMS').click()
    cy.contains('Téléchargement...').should('be.visible')
    cy.contains('succès', { timeout: 10000 }).should('be.visible')
  })

  it('should navigate to dashboard and display data', () => {
    // Navigation Dashboard
    cy.contains('Dashboard').click()
    cy.url().should('include', '/dashboard')

    // Vérification du contenu
    cy.contains('Dashboard Pandemetrix').should('be.visible')
    cy.contains('Nouveaux cas par jour').should('be.visible')
    
    // Vérification que le graphique se charge
    cy.get('canvas').should('be.visible')
  })
})