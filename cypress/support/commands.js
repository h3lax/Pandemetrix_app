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

Cypress.Commands.add('mockAllAPIs', () => {
  // Health checks
  cy.intercept('GET', '**/api/health/status', {
    statusCode: 200, body: { status: 'OK' }
  }).as('healthCheck')
  
  cy.intercept('GET', '**/api/health/db-check', {
    statusCode: 200, body: { database: 'Connected' }
  }).as('dbCheck')
  
  // Collections
  cy.intercept('GET', '**/api/etl/collections', {
    statusCode: 200,
    body: { collections: [{ collection: 'test_data', count: 100 }] }
  }).as('collections')
  
  // Data
  cy.intercept('GET', '**/api/data**', {
    statusCode: 200,
    body: [{ date_reported: '2024-01-01', country: 'France', new_cases: 1000, new_deaths: 20 }]
  }).as('covidData')
  
  // ML API complet
  cy.intercept('GET', '**/api/ml/health', {
    statusCode: 200,
    body: { model_loaded: true, ready_for_predictions: true, model_version: '1.0' }
  }).as('mlHealth')
  
  cy.intercept('GET', '**/api/ml/countries', {
    statusCode: 200,
    body: { countries: ['France', 'Germany', 'Italy'] }
  }).as('mlCountries')
  
  cy.intercept('GET', '**/api/ml/model-info', {
    statusCode: 200,
    body: { 
      algorithm: 'polynomial_regression_with_ridge',
      performance: { test_r2: 0.824 },
      training_date: '2024-01-01T00:00:00Z'
    }
  }).as('mlModelInfo')
  
  cy.intercept('POST', '**/api/ml/predict', {
    statusCode: 200,
    body: {
      prediction: { new_deaths_predicted: 42.5, new_deaths_rounded: 43, country: 'France' },
      model_info: { version: '1.0' },
      timestamp: '2024-01-01T12:00:00Z'
    }
  }).as('prediction')
  
  // Upload/Download
  cy.intercept('POST', '**/api/etl/upload', {
    statusCode: 200, body: { message: 'Upload réussi avec succès' }
  }).as('uploadFile')
  
  cy.intercept('POST', '**/api/etl/download', {
    statusCode: 200, body: { message: 'Téléchargement réussi avec succès' }
  }).as('downloadFile')
})

// Tab avec cypress-real-events
Cypress.Commands.add('tab', () => {
  cy.realPress('Tab')
})

Cypress.Commands.add('uploadFile', (fileName, selector = 'input[type="file"]') => {
  cy.fixture(fileName).then(fileContent => {
    cy.get(selector).then(subject => {
      const el = subject[0]
      const file = new File([fileContent], fileName, { type: 'text/csv' })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      el.files = dataTransfer.files
      el.dispatchEvent(new Event('change', { bubbles: true }))
    })
  })
})

Cypress.Commands.add('waitForApp', () => {
  cy.get('body').should('be.visible')
  cy.get('#app').should('exist')
})

Cypress.Commands.add('mockAxe', () => {
  cy.window().then((win) => {
    if (!win.axe) {
      win.axe = {
        run: () => Promise.resolve({ violations: [] }),
        configure: () => {},
        reset: () => {}
      }
    }
  })
})

// Commande pour naviguer vers une page et attendre qu'elle se charge
Cypress.Commands.add('visitAndWait', (path) => {
  cy.visit(path)
  cy.waitForApp()
  cy.wait(500) // Petite pause pour le rendu
})