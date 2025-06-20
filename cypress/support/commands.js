Cypress.Commands.add('uploadFile', (fileName, fileType = 'text/csv') => {
  cy.get('input[type="file"]').then(subject => {
    cy.fixture(fileName).then(content => {
      const el = subject[0]
      const testFile = new File([content], fileName, { type: fileType })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(testFile)
      el.files = dataTransfer.files
      
      cy.wrap(subject).trigger('change', { force: true })
    })
  })
})

Cypress.Commands.add('waitForAPI', (apiPath) => {
  cy.intercept('GET', `**/api${apiPath}`).as('apiCall')
  cy.wait('@apiCall')
})

Cypress.Commands.add('checkAccessibility', () => {
  cy.injectAxe()
  cy.checkA11y(null, {
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true }
    }
  })
})

Cypress.Commands.add('loginAsAdmin', () => {
  // Mock login si nécessaire
  cy.window().then((win) => {
    win.localStorage.setItem('user', JSON.stringify({ role: 'admin' }))
  })
})

Cypress.Commands.add('mockApiResponses', () => {
  cy.intercept('GET', '**/api/**', { statusCode: 200, body: {} })
})

Cypress.Commands.add('testResponsiveDesign', (viewports) => {
  viewports.forEach(viewport => {
    cy.viewport(viewport.width, viewport.height)
    cy.get('header').should('be.visible')
    cy.contains('Pandemetrix').should('be.visible')
  })
})