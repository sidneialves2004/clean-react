import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    fixturesFolder: false,
    supportFile: false,
    specPattern: './cypress/integration',
    baseUrl: 'http://localhost:3000',
    setupNodeEvents (on, config) {
      // implement node event listeners here
    }
  }
})
