import faker from 'faker'

export const mockUnauthorizedError = (url: RegExp): void => {
  cy.intercept({
    method: 'POST',
    url
  }, {
    statusCode: 401,
    body: {
      error: faker.random.words()
    }
  }).as('mockInvalidCredentialsError')
}

export const mockForbiddenError = (url: RegExp,method: string, delay?: number): void => {
  cy.intercept({
    method,
    url
  }, {
    delay,
    statusCode: 403,
    body: {
      error: faker.random.words()
    }
  }).as('mockEmailInUseError')
}

export const mockServerError = (url: RegExp, method: string, delay?: number): void => {
  cy.intercept({
    method,
    url
  }, {
    delay,
    statusCode: faker.helpers.randomize([400, 404, 500]),
    body: {
      error: faker.random.words()
    }
  }).as('mockUnexpectedError')
}

export const mockOk = (url: RegExp, method: string, body: any, delay?: number): void => {
  cy.intercept({
    method,
    url
  }, {
    statusCode: 200,
    body,
    delay
  }).as('mockOk')
}
