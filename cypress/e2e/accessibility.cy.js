describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visitAndWait('/')
    cy.mockAxe()
  })

  it('meets WCAG standards on homepage', () => {
    cy.injectAxe()
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true }
      }
    })
  })

  it('supports keyboard navigation', () => {
    // Test navigation avec Tab
    cy.get('body').tab()
    cy.focused().should('have.class', 'skip-link')
    
    // Navigation vers le contenu principal
    cy.get('a[href="#main-content"]').first().focus()
    cy.focused().should('exist')
  })

  it('has proper ARIA labels', () => {
    cy.visitAndWait('/analyse-ia')
    
    // Attendre que le formulaire se charge
    cy.get('form', { timeout: 10000 }).should('exist')
    
    // Vérifier les éléments avec ARIA
    cy.get('[aria-label]').should('have.length.greaterThan', 0)
    cy.get('[role="button"]').should('exist')
  })

  it('provides text alternatives for images', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt')
    })
  })

  it('has proper heading structure', () => {
    cy.get('h1').should('have.length', 1)
    cy.get('h1, h2, h3, h4, h5, h6').each(($heading, index, $headings) => {
      if (index > 0) {
        const currentLevel = parseInt($heading.prop('tagName').slice(1))
        const prevLevel = parseInt($headings.eq(index - 1).prop('tagName').slice(1))
        expect(currentLevel).to.be.at.most(prevLevel + 1)
      }
    })
  })
})