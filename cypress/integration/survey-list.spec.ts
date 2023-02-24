import faker from 'faker'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = 'surveys'
const mockUnexpectedError = (): void => Http.mockServerError('GET', path)
const mockAccessDiniedError = (): void => Http.mockForbiddenError('GET', path)

describe('SurveyList', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', { accessToken: faker.datatype.uuid(), name: faker.name.findName() })
  })

  it('should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde')
  })

  it('should logout on ForbiddenError', () => {
    mockAccessDiniedError()
    cy.visit('')
    Helper.testUrl('/login')
  })

  it('should present correct username', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.window().then((window: any) =>
      cy.getByTestId('username').should('contain.text', JSON.parse(window.localStorage.getItem('account')).name)
    )
  })

  it('should logout on logout link click', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('logout').click()
    Helper.testUrl('/login')
  })
})
