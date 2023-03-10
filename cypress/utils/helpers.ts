const baseUrl: string = Cypress.config().baseUrl

export const testHttpCallsCount = (alias: string, count: number): void => {
  cy.get(`@${alias}.all`).should('have.length', count)
}

export const testUrl = (path: string): void => {
  cy.url().should('eq', `${baseUrl}${path}`)
}

export const testLocalStorageItem = (key: string): void => {
  cy.window().then((window: any) => assert.isOk(window.localStorage.getItem(key)))
}

export const setLocalStorageItem = (key: string, value: object): void => {
  cy.window().then((window: any) => window.localStorage.setItem(key, JSON.stringify(value)))
}
