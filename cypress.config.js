import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      MOCK_API: true
    },
    setupNodeEvents(on, config) {
      // Éviter les boucles infinies avec axe
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
      
      // Skip certains tests en CI
      if (config.env.CI) {
        config.specPattern = [
          'cypress/e2e/accessibility.cy.js',
          'cypress/e2e/dashboard.cy.js',
          'cypress/e2e/etl-workflow.cy.js',
          'cypress/e2e/ia-analysis.cy.js'
        ]
      }
      
      return config
    }
  }
})