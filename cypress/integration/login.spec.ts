import faker from 'faker'
import * as FormHelper from '../support/form-helper'
import * as Http from '../support/login-mocks'

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('should load with correct initial state', () => {
    FormHelper.testInputStatus('email', 'Campo Obrigatório')
    cy.getByTestId('email').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('password', 'Campo Obrigatório')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    FormHelper.testInputStatus('email', 'Campo email inválido')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', 'Campo password deve ter no minimo 5 caracteres')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    FormHelper.testInputStatus('password')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present error if invalid credentials are provided - mocked return', () => {
    Http.mockInvalidCredentialsError()

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
    cy.wait('@mockInvalidCredentialsError')
    FormHelper.textMainError('Credenciais inválidas')
    FormHelper.testUrl('/login')
  })

  // it('should present error if invalid credentials are provided', () => {
  //   cy.getByTestId('email').focus().type(faker.internet.email())
  //   cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
  //   cy.getByTestId('submit').click()
  //   cy.getByTestId('error-wrap')
  //     .getByTestId('spinner').should('exist')
  //     .getByTestId('main-error').should('not.exist')
  //     .getByTestId('spinner').should('not.exist')
  //     .getByTestId('main-error').should('contain.text', 'Credenciais inválidas')
  //   cy.url().should('eq', `${baseUrl}/login`)
  // })

  it('should present error if server returns error [400,404,500]', () => {
    Http.mockUnexpectedError()
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
    cy.wait('@mockUnexpectedError')
    FormHelper.textMainError('Algo de errado aconteceu. Tente novamente mais tarde')
    FormHelper.testUrl('/login')
  })

  it('should present UnexpectedError if invalid data is returned', () => {
    Http.mockInvaldData()
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
    cy.wait('@mockOk')
    FormHelper.textMainError('Algo de errado aconteceu. Tente novamente mais tarde')
    FormHelper.testUrl('/login')
  })

  it('should save account if valid credentials are provided - mocked return', () => {
    Http.mockOk()
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
    cy.wait('@mockOk')
    cy.getByTestId('spinner').should('not.exist')
    FormHelper.testUrl('/')
    FormHelper.testLocalStorageItem('account')
  })

  // it('should save accessToken if valid credentials are provided', () => {
  //   cy.getByTestId('email').focus().type('sid44@gmail.com')
  //   cy.getByTestId('password').focus().type('123456')
  //   cy.getByTestId('submit').click()
  //   cy.getByTestId('error-wrap')
  //     .getByTestId('spinner').should('exist')
  //     .getByTestId('main-error').should('not.exist')
  //     .getByTestId('spinner').should('not.exist')
  //   cy.url().should('eq', `${baseUrl}/`)
  //   cy.window().then((window: any) => assert.isOk(window.localStorage.getItem('accessToken')))
  // })

  it('should prevent multiple submits', () => {
    Http.mockOk()
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').dblclick()
    FormHelper.testHttpCallsCount('mockOk', 1)
  })

  it('should Login submit the form by clicking the enter key in a field', () => {
    Http.mockOk()
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5)).type('{enter}')
    FormHelper.testHttpCallsCount('mockOk', 1)
    cy.getByTestId('spinner').should('not.exist')
    FormHelper.testUrl('/')
    FormHelper.testLocalStorageItem('account')
  })

  it('should not submit if form is invalid', () => {
    Http.mockOk()
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    FormHelper.testHttpCallsCount('mockOk', 0)
  })
})

// import faker from 'faker'

// const baseUrl: string = Cypress.config().baseUrl

// describe('Login', () => {
//   beforeEach(() => {
//     cy.visit('login')
//   })

//   it('should load with correct initial state', () => {
//     cy.getByTestId('email').should('have.attr', 'readOnly')
//     cy.getByTestId('password').should('have.attr', 'readOnly')
//     cy.getByTestId('email-status')
//       .should('have.attr', 'title', 'Campo Obrigatório')
//       .should('contain.text', '🔴')
//     cy.getByTestId('password-status')
//       .should('have.attr', 'title', 'Campo Obrigatório')
//       .should('contain.text', '🔴')
//     cy.getByTestId('submit').should('have.attr', 'disabled')
//     cy.getByTestId('error-wrap').should('not.have.descendants')
//   })

//   it('should present error state if form is invalid', () => {
//     cy.getByTestId('email').focus().type(faker.random.word())
//     cy.getByTestId('email-status')
//       .should('have.attr', 'title', 'Campo email inválido')
//       .should('contain.text', '🔴')
//     cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
//     cy.getByTestId('password-status')
//       .should('have.attr', 'title', 'Campo password deve ter no minimo 5 caracteres')
//       .should('contain.text', '🔴')
//     cy.getByTestId('submit').should('have.attr', 'disabled')
//     cy.getByTestId('error-wrap').should('not.have.descendants')
//   })

//   it('should present valid state if form is valid', () => {
//     cy.getByTestId('email').focus().type(faker.internet.email())
//     cy.getByTestId('email-status')
//       .should('have.attr', 'title', 'Tudo certo!')
//       .should('contain.text', '🟢')
//     cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
//     cy.getByTestId('password-status')
//       .should('have.attr', 'title', 'Tudo certo!')
//       .should('contain.text', '🟢')
//     cy.getByTestId('submit').should('not.have.attr', 'disabled')
//     cy.getByTestId('error-wrap').should('not.have.descendants')
//   })

//   it('should present error if invalid credentials are provided - mocked return', () => {
//     cy.intercept({ method: 'POST', path: 'login' }, {
//       statusCode: 401,
//       body: {
//         error: faker.random.words()
//       }
//     }).as('credentialFailure')

//     cy.getByTestId('email').focus().type(faker.internet.email())
//     cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
//     cy.getByTestId('submit').click()
//     cy.getByTestId('error-wrap')
//       .getByTestId('spinner').should('exist')
//       .getByTestId('main-error').should('not.exist')
//     cy.wait('@credentialFailure')
//     cy.getByTestId('error-wrap')
//     cy.getByTestId('spinner').should('not.exist')
//     cy.getByTestId('main-error').should('contain.text', 'Credenciais inválidas')
//     cy.url().should('eq', `${baseUrl}/login`)
//   })

//   // it('should present error if invalid credentials are provided', () => {
//   //   cy.getByTestId('email').focus().type(faker.internet.email())
//   //   cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
//   //   cy.getByTestId('submit').click()
//   //   cy.getByTestId('error-wrap')
//   //     .getByTestId('spinner').should('exist')
//   //     .getByTestId('main-error').should('not.exist')
//   //     .getByTestId('spinner').should('not.exist')
//   //     .getByTestId('main-error').should('contain.text', 'Credenciais inválidas')
//   //   cy.url().should('eq', `${baseUrl}/login`)
//   // })

//   it('should present error if server returns error 400', () => {
//     cy.intercept({ method: 'POST', path: 'login' }, {
//       statusCode: 400,
//       body: {
//         error: faker.random.words()
//       }
//     }).as('returnServerError')

//     cy.getByTestId('email').focus().type(faker.internet.email())
//     cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
//     cy.getByTestId('submit').click()
//     cy.getByTestId('error-wrap')
//       .getByTestId('spinner').should('exist')
//       .getByTestId('main-error').should('not.exist')
//     cy.wait('@returnServerError')
//     cy.getByTestId('error-wrap')
//     cy.getByTestId('spinner').should('not.exist')
//     cy.getByTestId('main-error').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde')
//     cy.url().should('eq', `${baseUrl}/login`)
//   })

//   it('should present error if the server does not respond', () => {
//     cy.intercept({ method: 'POST', path: 'login' }, {
//       statusCode: 404
//     }).as('returnServerError')

//     cy.getByTestId('email').focus().type(faker.internet.email())
//     cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
//     cy.getByTestId('submit').click()
//     cy.getByTestId('error-wrap')
//       .getByTestId('spinner').should('exist')
//       .getByTestId('main-error').should('not.exist')
//     cy.wait('@returnServerError')
//     cy.getByTestId('error-wrap')
//     cy.getByTestId('spinner').should('not.exist')
//     cy.getByTestId('main-error').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde')
//     cy.url().should('eq', `${baseUrl}/login`)
//   })

//   it('should present UnexpectedError if invalid data is returned', () => {
//     cy.intercept({ method: 'POST', path: 'login' }, {
//       statusCode: 200,
//       body: {
//         invalidProperty: faker.random.uuid()
//       }
//     }).as('invalidReturn')

//     cy.getByTestId('email').focus().type(faker.internet.email())
//     cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
//     cy.getByTestId('submit').click()
//     cy.getByTestId('error-wrap')
//       .getByTestId('spinner').should('exist')
//       .getByTestId('main-error').should('not.exist')
//     cy.wait('@invalidReturn')
//     cy.getByTestId('error-wrap')
//     cy.getByTestId('spinner').should('not.exist')
//     cy.getByTestId('main-error').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde')
//     cy.url().should('eq', `${baseUrl}/login`)
//   })

//   it('should save accessToken if valid credentials are provided - mocked return', () => {
//     cy.intercept({ method: 'POST', path: 'login' }, {
//       statusCode: 200,
//       body: {
//         accessToken: faker.random.uuid()
//       }
//     }).as('credentialValidates')

//     cy.getByTestId('email').focus().type(faker.internet.email())
//     cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
//     cy.getByTestId('submit').click()
//     cy.getByTestId('error-wrap')
//       .getByTestId('spinner').should('exist')
//       .getByTestId('main-error').should('not.exist')
//     cy.wait('@credentialValidates')
//     cy.getByTestId('spinner').should('not.exist')
//     cy.url().should('eq', `${baseUrl}/`)
//     cy.window().then((window: any) => assert.isOk(window.localStorage.getItem('accessToken')))
//   })

//   // it('should save accessToken if valid credentials are provided', () => {
//   //   cy.getByTestId('email').focus().type('sid44@gmail.com')
//   //   cy.getByTestId('password').focus().type('123456')
//   //   cy.getByTestId('submit').click()
//   //   cy.getByTestId('error-wrap')
//   //     .getByTestId('spinner').should('exist')
//   //     .getByTestId('main-error').should('not.exist')
//   //     .getByTestId('spinner').should('not.exist')
//   //   cy.url().should('eq', `${baseUrl}/`)
//   //   cy.window().then((window: any) => assert.isOk(window.localStorage.getItem('accessToken')))
//   // })

//   it('should prevent multiple submits', () => {
//     cy.intercept({ method: 'POST', path: 'login' }, {
//       statusCode: 200,
//       body: {
//         accessToken: faker.random.uuid()
//       }
//     }).as('request')

//     cy.getByTestId('email').focus().type(faker.internet.email())
//     cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
//     cy.getByTestId('submit').dblclick()
//     cy.get('@request.all').should('have.length', 1)
//   })

//   it('should Login submit the form by clicking the enter key in a field', () => {
//     cy.intercept({ method: 'POST', path: 'login' }, {
//       statusCode: 200,
//       body: {
//         accessToken: faker.random.uuid()
//       }
//     }).as('request')

//     cy.getByTestId('email').focus().type(faker.internet.email())
//     cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5)).type('{enter}')
//     cy.get('@request.all').should('have.length', 1)
//     cy.getByTestId('spinner').should('not.exist')
//     cy.url().should('eq', `${baseUrl}/`)
//     cy.window().then((window: any) => assert.isOk(window.localStorage.getItem('accessToken')))
//   })

//   it('should not submit if form is invalid', () => {
//     cy.intercept({ method: 'POST', path: 'login' }, {
//       statusCode: 200,
//       body: {
//         accessToken: faker.random.uuid()
//       }
//     }).as('request')

//     cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
//     cy.get('@request.all').should('have.length', 0)
//   })
// })
