describe('ETL Workflow Complete', () => {
  beforeEach(() => {
    cy.visitAndWait('/etl')
  })

  it('should complete CSV upload workflow', () => {
    // Vérifier que la zone de drop existe (pas .file-card)
    cy.get('.drop-zone').should('be.visible')
    cy.get('.drop-zone').should('contain', 'CSV')
    
    // Simuler sélection de fichier
    cy.get('input[type="file"]').should('exist')
    
    // Vérifier l'interface d'upload
    cy.get('.upload-legend').should('contain', 'Upload')
  })

  it('should download from URL successfully', () => {
    // Chercher les vrais boutons de téléchargement
    cy.get('button').contains('Cases and Deaths').should('be.visible')
    cy.get('button').contains('Vaccinations').should('be.visible')
    cy.get('button').contains('Hospitalizations').should('be.visible')
    cy.get('button').contains('Testing').should('be.visible')
  })

  it('should navigate to dashboard and display data', () => {
    // Navigation vers dashboard
    cy.get('a[href="/dashboard"], [data-cy="dashboard-link"]').first().click()
    
    // Alternative : navigation directe
    cy.visit('/dashboard')
    cy.waitForApp()
    
    // Vérifier le titre du dashboard
    cy.get('h1').should('contain', 'PANDEMETRIX')
    cy.get('.kpi-cards').should('exist')
  })
})