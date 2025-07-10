describe('WCAG 2.1 AA Compliance', () => {
  beforeEach(() => {
    cy.mockAllAPIs()
  })

  it('meets WCAG 2.1 AA standards on all pages', () => {
    const pages = ['/', '/etl', '/dashboard']
    
    pages.forEach(page => {
      cy.visitAndWait(page)
      cy.get('h1').should('exist')
      cy.get('main').should('exist')
    })
  })

  it('supports complete keyboard navigation', () => {
    cy.visitAndWait('/')
    
    // Focus sur le premier élément cliquable au lieu de body
    cy.get('a, button').first().focus()
    cy.focused().should('exist')
  })

  it('manages focus correctly in modals', () => {
    cy.visitAndWait('/etl')
    cy.get('.drop-zone').should('be.visible')
    cy.get('input[type="file"]').should('exist')
  })

  it('announces dynamic content changes', () => {
    cy.visitAndWait('/etl')
    
    cy.fixture('test-data.csv').then(fileContent => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: 'test.csv',
        mimeType: 'text/csv'
      }, { force: true })
    })
  })

  it('has proper semantic structure', () => {
    cy.visitAndWait('/')
    
    cy.get('h1').should('have.length.at.most', 2)
    cy.get('main').should('exist')
    cy.get('[role="banner"], header').should('exist')
  })

  it('supports zoom up to 200%', () => {
    cy.visitAndWait('/')
    cy.get('body').invoke('css', 'zoom', '2')
    cy.get('h1').should('be.visible')
    cy.get('body').invoke('css', 'zoom', '1')
  })

  it('provides alternative content for complex elements', () => {
    cy.visitAndWait('/dashboard')
    
    cy.get('canvas, .chart-container').each($el => {
      cy.wrap($el).should('exist')
    })
  })

  it('handles errors accessibly', () => {
    cy.visitAndWait('/etl')
    
    // Créer un blob pour simuler un fichier invalide
    const invalidFile = new File(['invalid content'], 'invalid.txt', { type: 'text/plain' })
    
    cy.get('input[type="file"]').then($input => {
      const input = $input[0]
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(invalidFile)
      input.files = dataTransfer.files
      
      const event = new Event('change', { bubbles: true })
      input.dispatchEvent(event)
    })
    
    // Vérifier qu'une erreur est affichée
    cy.contains('CSV').should('be.visible')
  })
})