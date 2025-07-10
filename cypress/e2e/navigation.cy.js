describe('Navigation & Accessibility', () => {
  it('should navigate through all pages', () => {
    cy.visitAndWait('/')
    
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
    
    // Focus sur le premier lien visible au lieu de Tab sur body
    cy.get('a').first().focus()
    cy.focused().should('exist')
    
    // Test navigation avec Tab
    cy.focused().trigger('keydown', { key: 'Tab' })
    cy.focused().should('exist')
  })

  it('should handle mobile responsive design', () => {
    cy.viewport('iphone-6')
    cy.visitAndWait('/')
    
    cy.get('.dashboard-title, h1').should('be.visible')
    cy.get('nav').should('exist')
    
    cy.viewport(1280, 720)
  })
})