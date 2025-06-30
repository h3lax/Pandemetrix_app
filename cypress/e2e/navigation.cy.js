describe('Navigation & Accessibility', () => {
  it('should navigate through all pages', () => {
    cy.visit('/')

    // Test navigation complète
    const pages = [
      { link: 'Upload Dataset', url: '/etl' },
      { link: 'Dashboard', url: '/dashboard' },
      { link: 'Status', url: '/datasheet' },
      { link: 'Analysis-IA', url: '/analyse-ia' },
      { link: 'A Propos', url: '/about' }
    ]

    pages.forEach(page => {
      cy.contains(page.link).click()
      cy.url().should('include', page.url)
      cy.go('back')
    })
  })

  it('should be keyboard accessible', () => {
    cy.visit('/etl')
    
    // Navigation par Tab
    cy.get('body').tab()
    cy.focused().should('have.class', 'drop-zone')
    
    // Activation par Enter
    cy.focused().type('{enter}')
    // Le sélecteur de fichier devrait s'ouvrir
  })

  it('should handle mobile responsive design', () => {
    cy.viewport(375, 667) // iPhone SE
    cy.visit('/')
    
    // Vérification responsive
    cy.get('header').should('be.visible')
    cy.contains('Pandemetrix').should('be.visible')
  })
})