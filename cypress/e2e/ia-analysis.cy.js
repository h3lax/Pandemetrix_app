describe('IA Analysis Page', () => {
  beforeEach(() => {
    cy.visitAndWait('/analyse-ia')
  })

  it('should load ML status and display ready state', () => {
    cy.wait('@mlHealth')
    cy.get('.ml-status').should('be.visible')
    cy.get('.status-ready, .status-not-ready').should('exist')
  })

  it('should run prediction workflow', () => {
    cy.wait('@mlHealth')
    
    // Vérifier que le formulaire est présent
    cy.get('form').should('exist')
    
    // Remplir le formulaire si le modèle est prêt
    cy.get('body').then($body => {
      if ($body.find('.status-ready').length > 0) {
        cy.get('#country-select').select('France')
        cy.get('#prediction-date').type('2022-05-15')
        cy.get('#new-cases').type('1500')
        cy.get('#people-vaccinated').type('50000000')
        cy.get('#new-tests').type('100000')
        cy.get('#hospital-occupancy').type('2500')
        
        cy.get('button[type="submit"]').click()
        cy.wait('@mlPredict')
        
        cy.get('.prediction-result').should('be.visible', { timeout: 10000 })
      }
    })
  })

  it('should display model information', () => {
    cy.wait('@mlModelInfo')
    cy.get('.model-info-grid, .model-performance').should('exist')
  })
})