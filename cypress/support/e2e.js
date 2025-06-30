import './commands'

// Désactiver les exceptions non capturées qui cassent les tests
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})