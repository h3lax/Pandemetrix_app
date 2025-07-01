describe('IA Analysis Page', () => {
  beforeEach(() => {
    // Mock des endpoints ML mis à jour
    cy.intercept('GET', '**/api/ml/health', {
      statusCode: 200,
      body: {
        model_loaded: true,
        ready_for_predictions: true,
        model_version: '1.0',
        status: 'ready'
      }
    }).as('mlHealth')

    cy.intercept('GET', '**/api/ml/countries', {
      statusCode: 200,
      body: {
        countries: ['France', 'Germany', 'Italy'],
        total_countries: 3
      }
    }).as('mlCountries')

    cy.intercept('GET', '**/api/ml/model-info', {
      statusCode: 200,
      body: {
        name: 'COVID-19 Deaths Prediction Model',
        algorithm: 'polynomial_regression_with_ridge',
        performance: { test_r2: 0.824 }
      }
    }).as('mlModelInfo')

    cy.visit('/analyse-ia')
  })

  it('should load ML status and display ready state', () => {
    cy.wait('@mlHealth')
    cy.contains('✅ Modèle prêt').should('be.visible')
  })

  it('should run prediction workflow', () => {
    cy.wait(['@mlHealth', '@mlCountries', '@mlModelInfo'])
    
    // Sélection pays
    cy.get('#country-select').select('France')
    
    // Date dans la plage valide
    cy.get('#prediction-date').type('2022-05-15')
    
    // Valeurs numériques
    cy.get('#new-cases').clear().type('1500')
    cy.get('#people-vaccinated').clear().type('50000000')
    cy.get('#new-tests').clear().type('100000')
    cy.get('#hospital-occupancy').clear().type('2500')

    // Mock de l'appel de prédiction
    cy.intercept('POST', '**/api/ml/predict', {
      statusCode: 200,
      body: {
        prediction: {
          new_deaths_predicted: 42.5,
          new_deaths_rounded: 43,
          country: 'France',
          date: '2022-05-15'
        },
        model_info: { version: '1.0' },
        timestamp: new Date().toISOString()
      }
    }).as('prediction')

    // Lancement prédiction
    cy.contains('Lancer la prédiction').click()
    
    cy.wait('@prediction')
    cy.contains('Résultat de la prédiction').should('be.visible')
    cy.contains('43').should('be.visible') // Décès prédits
  })

  it('should display model information', () => {
    cy.wait('@mlModelInfo')
    cy.contains('Informations du modèle IA').should('be.visible')
    cy.contains('polynomial_regression_with_ridge').should('be.visible')
  })
})