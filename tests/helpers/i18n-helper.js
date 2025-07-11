import { createI18n } from 'vue-i18n'

// Helper pour créer une instance i18n pour les tests
export function createTestI18n(customMessages = {}) {
  const messages = {
    fr: {
      app: {
        title: "Pandemetrix",
        subtitle: "modèle prédictif de pandémies"
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
        dragDrop: "Glissez votre fichier CSV ici",
        clickSelect: "ou cliquez pour sélectionner",
        success: "Fichier uploadé avec succès",
        error: "Erreur d'upload",
        datasetTitle: "Titre du jeu de données",
        titleRequiredError: "Le titre est requis (minimum 3 caractères)"
      },
      dashboard: {
        title: "PANDEMETRIX ANALYTICS",
        infectionRate: "Taux d'infection",
        mortalityRate: "Taux de mortalité",
        recoveryRate: "Taux de guérison"
      },
      analysis: {
        title: "Analyse IA / Modèles de Prédictions"
      },
      status: {
        title: "Statut du système",
        api: "API",
        database: "Base de données",
        connected: "Connecté"
      },
      about: {
        title: "À propos de Pandemetrix",
        description: "Pandemetrix est un modèle prédictif",
        technologies: "Ce projet utilise des technologies modernes"
      },
      common: {
        cancel: "Annuler",
        validate: "Valider"
      },
      ...customMessages.fr
    }
  }

  return createI18n({
    legacy: false,
    locale: 'fr',
    fallbackLocale: 'fr',
    messages
  })
}

// Configuration globale pour tous les tests
export const defaultTestI18n = createTestI18n()