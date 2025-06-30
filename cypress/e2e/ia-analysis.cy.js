describe('IA Analysis Page', () => {
  beforeEach(() => {
    cy.visit('/analyse-ia')
  })

  it('should run prediction workflow', () => {
    // Sélection dataset
    cy.get('#dataset-select').select('Cas quotidiens France')
    
    // Sélection modèle
    cy.get('#model-select').select('RandomForest')
    
    // Lancement prédiction
    cy.contains('Lancer la prédiction').click()
    
    // Attendre le résultat
    cy.contains('Prédiction en cours...').should('be.visible')
    cy.contains('Résultat de la prédiction', { timeout: 5000 }).should('be.visible')
    
    // Vérifier l'affichage du graphique
    cy.get('canvas').should('be.visible')
  })

  it('should display model comparison table', () => {
    cy.get('.model-table').should('be.visible')
    cy.get('.model-table').should('contain', 'RandomForest')
    cy.get('.model-table').should('contain', 'XGBoost')
    cy.get('.model-table').should('contain', 'Précision')
  })
})