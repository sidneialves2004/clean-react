import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    fixturesFolder: './cypress/fixtures',
    supportFile: './cypress/support/index.js',
    specPattern: './cypress/integration',
    baseUrl: 'http://localhost:3000',
    video: false,
    setupNodeEvents (on, config) {
      // implement node event listeners here
    }
  }
})
