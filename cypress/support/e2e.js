import './commands'
import 'cypress-axe'
import 'cypress-real-events/support'

Cypress.on('uncaught:exception', (err, runnable) => {
  return false // Ignore toutes les erreurs pour la CI
})