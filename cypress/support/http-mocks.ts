import faker from 'faker'

export const mockInvalidCredentialsError = (path: string): void => {
  cy.intercept({
    method: 'POST',
    path
  }, {
    statusCode: 401,
    body: {
      error: faker.random.words()
    }
  }).as('mockInvalidCredentialsError')
}

export const mockEmailInUseError = (path: string): void => {
  cy.intercept({
    method: 'POST',
    path
  }, {
    statusCode: 403,
    body: {
      error: faker.random.words()
    }
  }).as('mockEmailInUseError')
}

export const mockUnexpectedError = (method: string, path: string): void => {
  cy.intercept({
    method,
    path
  }, {
    statusCode: faker.helpers.randomize([400, 404, 500]),
    body: {
      error: faker.random.words()
    }
  }).as('mockUnexpectedError')
}

export const mockOk = (method: string, path: string, body: any,delay?: number): void => {
  cy.intercept({
    method,
    path
  }, {
    delay,
    statusCode: 200,
    body
  }).as('mockOk')
}
