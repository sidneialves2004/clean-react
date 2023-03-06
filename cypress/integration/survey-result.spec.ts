import faker from 'faker'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /api\/surveys/

const surveyResult = {
  question: 'Question 1',
  date: '2018-02-03T00:00:00',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
    count: 2,
    percent: 70,
    isCurrentAccountAnswer: true
  },{
    answer: 'any_answer2',
    count: 1,
    percent: 30,
    isCurrentAccountAnswer: false
  }]
}

const mockSuccess = (): void => Http.mockOk(path, 'GET', surveyResult, 1000)
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

  it('should reload on button click', () => {
    mockUnexpectedError()
    cy.visit('/surveys/any_id/results')
    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde')
    mockSuccess()
    cy.getByTestId('reload').click()
    cy.wait('@mockOk')
    cy.getByTestId('question').should('exist')
  })
})
