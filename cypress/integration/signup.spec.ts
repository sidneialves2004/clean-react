import * as FormHelper from '../utils/form-helpers'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'
import faker from 'faker'

const path = 'signup'
const mockEmailInUseError = (): void => Http.mockForbiddenError('POST',path)
const mockUnexpectedError = (): void => Http.mockServerError('POST',path)
const mockSuccess = (delay?: number): void => Http.mockOk('POST',path, { accessToken: faker.random.uuid(), name: faker.name.findName() }, delay)

describe('Signup', () => {
  beforeEach(() => {
    cy.visit('signup')
  })

  it('should load with correct initial state', () => {
    FormHelper.testInputStatus('name', 'Campo Obrigatório')
    cy.getByTestId('name').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('email', 'Campo Obrigatório')
    cy.getByTestId('email').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('password', 'Campo Obrigatório')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('passwordConfirmation', 'Campo Obrigatório')
    cy.getByTestId('passwordConfirmation').should('have.attr', 'readOnly')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present error state if form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('name', 'Campo name deve ter no minimo 5 caracteres')
    cy.getByTestId('email').focus().type(faker.random.word())
    FormHelper.testInputStatus('email', 'Campo email inválido')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', 'Campo password deve ter no minimo 5 caracteres')
    cy.getByTestId('passwordConfirmation').focus().type(faker.random.alphaNumeric(4))
    FormHelper.testInputStatus('passwordConfirmation', 'Campo passwordConfirmation inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present valid state if form is valid', () => {
    const password = faker.random.alphaNumeric(5)
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(5))
    FormHelper.testInputStatus('name')
    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')
    cy.getByTestId('password').focus().type(password)
    FormHelper.testInputStatus('password')
    cy.getByTestId('passwordConfirmation').focus().type(password)
    FormHelper.testInputStatus('passwordConfirmation')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('should present EmailInUseError on 403', () => {
    mockEmailInUseError()
    const password = faker.random.alphaNumeric(5)
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(7))
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(password)
    cy.getByTestId('passwordConfirmation').focus().type(password)
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
    cy.wait('@mockEmailInUseError')
    FormHelper.textMainError('Este Email ja está em uso')
    Helper.testUrl('/signup')
  })

  it('should present error if server returns error [400,404,500]', () => {
    const password = faker.random.alphaNumeric(5)
    mockUnexpectedError()
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(7))
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(password)
    cy.getByTestId('passwordConfirmation').focus().type(password)
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
    cy.wait('@mockUnexpectedError')
    FormHelper.textMainError('Algo de errado aconteceu. Tente novamente mais tarde')
    Helper.testUrl('/signup')
  })

  it('should save account if valid register', () => {
    const password = faker.random.alphaNumeric(5)
    mockSuccess(1000)
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(7))
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(password)
    cy.getByTestId('passwordConfirmation').focus().type(password)
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
    cy.wait('@mockOk')
    cy.getByTestId('spinner').should('not.exist')
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('should prevent multiple submits', () => {
    const password = faker.random.alphaNumeric(5)
    mockSuccess()
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(7))
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(password)
    cy.getByTestId('passwordConfirmation').focus().type(password)
    cy.getByTestId('submit').dblclick()
    Helper.testHttpCallsCount('mockOk', 1)
  })

  it('should Signup submit the form by clicking the enter key in a field', () => {
    const password = faker.random.alphaNumeric(5)
    mockSuccess()
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(7))
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(password).type('{enter}')
    cy.getByTestId('passwordConfirmation').focus().type(password).type('{enter}')
    Helper.testHttpCallsCount('mockOk', 1)
    cy.getByTestId('spinner').should('not.exist')
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('should not submit if form is invalid', () => {
    mockSuccess()
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    Helper.testHttpCallsCount('mockOk', 0)
  })
})
