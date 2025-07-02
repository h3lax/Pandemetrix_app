module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: [
    '**/tests/unit/**/*.test.js'
  ],
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/**',
    '!**/node_modules/**'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(chart.js|vue-chartjs|@vue|vue)/)'
  ],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  // Fix pour import.meta.env
  globals: {
    'import.meta': {
      env: {
        VITE_API_BASE_URL: 'http://localhost:5000',
        VITE_ML_API_BASE_URL: 'http://localhost:5001/api/v1/covid'
      }
    }
  }
}