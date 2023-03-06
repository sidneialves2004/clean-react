import faker from 'faker'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /api\/surveys/

const mockUnexpectedError = (): void => Http.mockServerError(path,'GET')

describe('SurveyResult', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', { accessToken: faker.datatype.uuid(), name: faker.name.findName() })
  })

  it('should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.visit('/surveys/any_id/results')
    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde')
  })
})
