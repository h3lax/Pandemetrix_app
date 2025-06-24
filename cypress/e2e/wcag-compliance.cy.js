describe('WCAG 2.1 AA Compliance', () => {
  beforeEach(() => {
    cy.injectAxe()
  })

  it('meets WCAG 2.1 AA standards on all pages', () => {
    const pages = ['/', '/etl', '/dashboard', '/datasheet', '/analyse-ia', '/about']
    
    pages.forEach(page => {
      cy.visit(page)
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'focus-management': { enabled: true },
          'landmark-unique': { enabled: true },
          'heading-order': { enabled: true },
          'aria-roles': { enabled: true },
          'aria-labels': { enabled: true },
          'form-labels': { enabled: true }
        }
      })
    })
  })

  it('supports complete keyboard navigation', () => {
    cy.visit('/')
    
    // Skip links
    cy.get('body').tab()
    cy.focused().should('contain', 'Aller au contenu principal')
    cy.focused().type('{enter}')
    cy.focused().should('have.id', 'main-content')
    
    // Navigation menu
    cy.visit('/')
    cy.get('[role="menubar"] [role="menuitem"]').first().focus()
    cy.focused().should('have.attr', 'role', 'menuitem')
  })

  it('manages focus correctly in modals', () => {
    cy.visit('/etl')
    cy.get('.drop-zone').click()
    
    // Focus should be in modal
    cy.focused().should('have.id', 'dataset-title')
    
    // Tab trapping
    cy.focused().tab().tab().tab()
    cy.focused().should('have.id', 'dataset-title') // Should wrap
    
    // Escape closes modal
    cy.get('body').type('{esc}')
    cy.get('[role="dialog"]').should('not.exist')
  })

  it('announces dynamic content changes', () => {
    cy.visit('/etl')
    
    // Upload file
    cy.fixture('test-data.csv').then(fileContent => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: 'test.csv',
        mimeType: 'text/csv'
      })
    })
    
    cy.get('#dataset-title').type('Test Dataset')
    cy.contains('Valider').click()
    
    // Check live region
    cy.get('[aria-live="polite"]').should('contain', 'succès')
  })

  it('has proper semantic structure', () => {
    cy.visit('/')
    
    // Landmarks
    cy.get('[role="banner"]').should('exist')
    cy.get('[role="main"]').should('exist')
    cy.get('[role="navigation"]').should('exist')
    cy.get('[role="contentinfo"]').should('exist')
    
    // Heading hierarchy
    cy.get('h1').should('exist')
    cy.get('h1').should('have.length', 1) // Only one h1 per page
  })

  it('supports zoom up to 200%', () => {
    cy.viewport(640, 512) // Simulates 200% zoom
    cy.visit('/')
    
    // Content should remain accessible
    cy.get('h1').should('be.visible')
    cy.get('[role="navigation"]').should('be.visible')
    
    // Interactive elements should be accessible
    cy.get('button, a, input').each($el => {
      cy.wrap($el).should('be.visible')
    })
  })

  it('provides alternative content for complex elements', () => {
    cy.visit('/dashboard')
    
    // Chart should have description
    cy.get('#chart-description').should('exist')
    cy.get('[role="img"]').should('have.attr', 'aria-describedby')
    
    // Data table alternative
    cy.get('details summary').should('contain', 'tableau')
  })

  it('handles errors accessibly', () => {
    cy.visit('/etl')
    
    // Trigger error
    cy.get('.drop-zone').selectFile('cypress/fixtures/invalid.txt', { force: true })
    
    // Error should be announced
    cy.get('[role="alert"]').should('exist')
    cy.get('.error-message').should('be.visible')
  })
})