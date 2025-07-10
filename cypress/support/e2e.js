import './commands'
import 'cypress-axe'

// Configuration globale
beforeEach(() => {
  // Mock toutes les APIs ML qui causent des timeouts
  cy.intercept('GET', '**/api/v1/covid/health', {
    statusCode: 200,
    body: {
      ready_for_predictions: true,
      model_version: '1.0',
      model_loaded: true
    }
  }).as('mlHealth')
  
  cy.intercept('GET', '**/api/v1/covid/countries', {
    statusCode: 200,
    body: {
      countries: ['France', 'Germany', 'Italy'],
      total_countries: 3
    }
  }).as('mlCountries')
  
  cy.intercept('GET', '**/api/v1/covid/model-info', {
    statusCode: 200,
    body: {
      algorithm: 'polynomial_regression',
      training_date: '2024-01-01',
      performance: { test_r2: 0.85 }
    }
  }).as('mlModelInfo')
  
  cy.intercept('POST', '**/api/v1/covid/predict-batch', {
    statusCode: 200,
    body: {
      results: [{
        new_deaths_predicted: 42.5,
        country: 'France',
        date: '2022-05-15'
      }],
      model_version: '1.0'
    }
  }).as('mlPredict')

  // Mock API principale
  cy.intercept('GET', '**/api/health/status', {
    statusCode: 200,
    body: { status: 'OK' }
  }).as('apiHealth')
  
  cy.intercept('GET', '**/api/health/db-check', {
    statusCode: 200,
    body: { database: 'Connected' }
  }).as('dbHealth')
  
  cy.intercept('GET', '**/api/data*', {
    statusCode: 200,
    body: [
      {
        date: '2024-01-01',
        country: 'France',
        new_cases: 1000,
        new_deaths: 10
      }
    ]
  }).as('getData')
})

// Commandes personnalisées pour l'accessibilité
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.injectAxe()
  cy.checkA11y(context, options)
})