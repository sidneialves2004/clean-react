import faker from 'faker'
import * as Helper from '../support/helpers'
import * as Http from '../support/survey-list-mocks'

describe('SurveyList', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', { accessToken: faker.random.uuid(), name: faker.name.findName() })
  })

  it('should present error on UnexpectedError', () => {
    Http.mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde')
  })

  it('should logout on ForbiddenError', () => {
    Http.mockAccessDiniedError()
    cy.visit('')
    Helper.testUrl('/login')
  })
})
