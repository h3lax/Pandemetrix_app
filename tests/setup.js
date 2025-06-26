import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'

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

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock Chart.js
jest.mock('chart.js/auto', () => ({
  Chart: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
    render: jest.fn(),
    resize: jest.fn()
  })),
  registerables: []
}))

// Mock vue-chartjs
jest.mock('vue-chartjs', () => ({
  Line: {
    name: 'Line',
    template: '<div class="mock-line-chart"></div>'
  }
}))

jest.mock('plotly', () => ({
  newPlot: jest.fn().mockResolvedValue(true),
  restyle: jest.fn().mockResolvedValue(true),
  relayout: jest.fn().mockResolvedValue(true)
}))

// Mock window.fs pour les tests de lecture de fichiers
Object.defineProperty(window, 'fs', {
  value: {
    readFile: jest.fn().mockResolvedValue('mock file content')
  }
})

// Mock fetch API
global.fetch = jest.fn()

// Mock console methods pour réduire le bruit dans les tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}