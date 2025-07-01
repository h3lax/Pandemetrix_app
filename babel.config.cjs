// babel.config.cjs - MISE À JOUR
module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: 'auto' // Permet à Jest de gérer les modules
    }]
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { 
          targets: { node: 'current' },
          modules: 'commonjs' // Force CommonJS pour les tests Jest
        }]
      ]
    }
  }
}