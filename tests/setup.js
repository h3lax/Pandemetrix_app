import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// Mock i18n pour les tests
const mockI18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr: {
      app: {
        title: "Pandemetrix",
        subtitle: "modèle prédictif de pandémies",
        description: "Application Pandemetrix"
      },
      nav: {
        home: "Accueil",
        upload: "Upload Dataset",
        dashboard: "Dashboard",
        status: "Status",
        analysis: "Analysis-IA",
        about: "À Propos"
      },
      etl: {
        title: "Gestionnaire ETL",
        uploadCsv: "Upload CSV",
        downloadUrl: "Télécharger depuis une URL",
        dragDrop: "Glissez votre fichier CSV ici",
        clickSelect: "ou cliquez pour sélectionner",
        uploading: "Upload en cours...",
        success: "Fichier uploadé avec succès",
        error: "Erreur d'upload",
        invalidFile: "Veuillez sélectionner un fichier CSV",
        fileTooBig: "Le fichier est trop volumineux (max 60MB)",
        titleRequired: "Le titre est requis avant l'upload",
        datasetTitle: "Titre du jeu de données",
        enterTitle: "Veuillez saisir un titre descriptif pour votre jeu de données",
        titleDataset: "Titre du dataset",
        titlePlaceholder: "Ex: Données COVID-19 mai 2025",
        titleMinLength: "Le titre doit contenir au moins 3 caractères",
        titleRequiredError: "Le titre est requis (minimum 3 caractères)"
      },
      dashboard: {
        title: "PANDEMETRIX ANALYTICS",
        infectionRate: "Taux d'infection",
        mortalityRate: "Taux de mortalité",
        recoveryRate: "Taux de guérison"
      },
      analysis: {
        title: "Analyse IA / Modèles de Prédictions",
        runPredictions: "Lancer des prédictions COVID-19",
        modelReady: "Modèle prêt",
        country: "Pays",
        predictionDate: "Date de prédiction"
      },
      status: {
        title: "Statut du système",
        servicesStatus: "État des services",
        api: "API",
        database: "Base de données",
        connected: "Connecté",
        disconnected: "Déconnecté"
      },
      about: {
        title: "À propos de Pandemetrix",
        description: "Pandemetrix est un modèle prédictif",
        technologies: "Ce projet utilise des technologies modernes"
      },
      common: {
        loading: "Chargement en cours...",
        error: "Une erreur est survenue",
        cancel: "Annuler",
        validate: "Valider"
      }
    }
  }
})

// Mock api.js directement pour éviter import.meta.env
jest.mock('@/services/api', () => ({
  __esModule: true,
  api: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} })
  },
  etl: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} })
  }
}))

// Mock HTMLCanvasElement pour Chart.js
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: [] })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}))

config.global.plugins = [mockI18n]
config.global.mocks = {
  $route: { name: 'Home' },
  $router: { push: jest.fn() }
}

config.global.stubs = {
  'router-link': true,
  'router-view': true
}

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.fetch = jest.fn()
global.console = { ...console, log: jest.fn(), warn: jest.fn(), error: jest.fn() }