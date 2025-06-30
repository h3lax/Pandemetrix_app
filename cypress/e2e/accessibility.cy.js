describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.injectAxe()
  })

  it('meets WCAG standards on homepage', () => {
    cy.visit('/')
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true }
      }
    })
  })

  it('supports keyboard navigation', () => {
    cy.visit('/etl')
    cy.get('body').tab()
    cy.focused().should('have.class', 'drop-zone')
    cy.focused().type('{enter}')
  })

  it('has proper ARIA labels', () => {
    cy.visit('/analyse-ia')
    cy.get('#dataset-select').should('have.attr', 'aria-label')
    cy.get('#model-select').should('have.attr', 'aria-label')
  })
})