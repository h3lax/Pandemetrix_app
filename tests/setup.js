import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'

// Configuration globale Vue Test Utils
config.global.stubs = {
  'router-link': true,
  'router-view': true
}

// Mock global objects
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock Chart.js
jest.mock('chart.js/auto', () => ({
  Chart: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
    render: jest.fn()
  })),
  registerables: []
}))

// Mock window.fs pour les tests de lecture de fichiers
Object.defineProperty(window, 'fs', {
  value: {
    readFile: jest.fn()
  }
})