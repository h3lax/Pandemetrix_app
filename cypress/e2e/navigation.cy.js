describe('Navigation & Accessibility', () => {
  it('should navigate through all pages', () => {
    cy.visitAndWait('/')
    
    // Tester navigation vers chaque page
    const pages = [
      { path: '/etl', text: 'ETL' },
      { path: '/dashboard', text: 'Dashboard' },
      { path: '/datasheet', text: 'Status' },
      { path: '/analyse-ia', text: 'Analysis' },
      { path: '/about', text: 'À Propos' }
    ]
    
    pages.forEach(page => {
      cy.visit(page.path)
      cy.waitForApp()
      cy.url().should('include', page.path)
    })
  })

  it('should be keyboard accessible', () => {
    cy.visitAndWait('/')
    
    // Test navigation au clavier
    cy.get('body').tab()
    
    // Le premier élément focusable devrait être le skip link
    cy.focused().should('have.class', 'skip-link')
    
    // Continuer la navigation
    cy.focused().tab()
    
    // Vérifier qu'un élément est focusé
    cy.focused().should('exist')
  })

  it('should handle mobile responsive design', () => {
    cy.viewport('iphone-6')
    cy.visitAndWait('/')
    
    // Vérifier que le contenu s'adapte
    cy.get('.dashboard-title, h1').should('be.visible')
    cy.get('nav').should('exist')
    
    // Retour desktop
    cy.viewport(1280, 720)
  })
})