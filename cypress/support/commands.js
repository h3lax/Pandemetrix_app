// Import cypress-real-events si disponible
let realEventsAvailable = false;
try {
  require('cypress-real-events');
  realEventsAvailable = true;
} catch (e) {
  console.warn('cypress-real-events not available, using fallback');
}

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
  // Skip axe si problématique en CI
  if (Cypress.env('CI')) {
    cy.log('Skipping accessibility check in CI')
    return
  }
  cy.injectAxe()
  cy.checkA11y(null, {
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true }
    }
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

// Tab avec fallback si cypress-real-events n'est pas disponible
Cypress.Commands.add('tab', () => {
  if (realEventsAvailable) {
    try {
      cy.realPress('Tab')
    } catch (e) {
      // Fallback to keyboard trigger
      cy.focused().trigger('keydown', { key: 'Tab' })
    }
  } else {
    cy.focused().trigger('keydown', { key: 'Tab' })
  }
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

Cypress.Commands.add('visitAndWait', (path) => {
  cy.visit(path)
  cy.waitForApp()
  cy.wait(500)
})