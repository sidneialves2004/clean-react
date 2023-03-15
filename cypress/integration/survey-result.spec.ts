import faker from 'faker'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const pathSurveyResult = /api\/surveys\/any_id/
const pathSurveyList = /api\/surveys/

const surveyList = [{
  question: 'Question 1',
  date: '2018-02-03T00:00:00',
  didAnswer: true,
  id: '1'
},{
  question: 'Question 2',
  date: '2020-11-13T00:00:00',
  didAnswer: false,
  id: '2'
}]

const surveyResult = {
  question: 'Question 1',
  date: new Date('2018-02-03T00:00:00'),
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

const mockLoadSuccessResult = (): void => Http.mockOk(pathSurveyResult, 'GET', surveyResult, 'mockOk', 1000)
const mockSuccessList = (): void => Http.mockOk(pathSurveyList, 'GET', surveyList, 'mockOkList', 1000)

describe('SurveyResult', () => {
  const mockAccessDiniedError = (): void => Http.mockForbiddenError(pathSurveyResult, 'GET')
  const mockUnexpectedError = (): void => Http.mockServerError(pathSurveyResult,'GET')

  describe('load',() => {
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
      mockLoadSuccessResult()
      cy.getByTestId('reload').click()
      cy.wait('@mockOk')
      cy.getByTestId('question').should('exist')
    })

    it('should logout on AccessDiniedError', () => {
      mockAccessDiniedError()
      cy.visit('/surveys/any_id')
      Helper.testUrl('/login')
    })

    it('should present survey items', () => {
      mockLoadSuccessResult()
      cy.visit('/surveys/any_id')
      cy.getByTestId('question').should('have.text', surveyResult.question)
      cy.getByTestId('day').should('have.text', surveyResult.date.getDate().toString().padStart(2,'0'))
      cy.getByTestId('month').should('have.text', surveyResult.date.toLocaleString('pt-BR', { month: 'short' }).replace('.',''))
      cy.getByTestId('year').should('have.text', surveyResult.date.getFullYear())

      cy.get('li:nth-child(1)').then(li => {
        assert.equal(li.find('[data-testid="answer"]').text(), surveyResult.answers[0].answer)
        assert.equal(li.find('[data-testid="image"]').attr('src'), surveyResult.answers[0].image)
        assert.equal(li.find('[data-testid="percent"]').text(), `${surveyResult.answers[0].percent}%`)
        if (surveyResult.answers[0].isCurrentAccountAnswer) assert.notEqual(li.css('box-shadow'), 'none')
        else assert.equal(li.css('box-shadow'), 'none')
      })

      cy.get('li:nth-child(2)').then(li => {
        assert.equal(li.find('[data-testid="answer"]').text(), surveyResult.answers[1].answer)
        assert.equal(li.find('[data-testid="image"]').attr('src'), surveyResult.answers[1].image)
        assert.equal(li.find('[data-testid="percent"]').text(), `${surveyResult.answers[1].percent}%`)
        if (surveyResult.answers[1].isCurrentAccountAnswer) assert.notEqual(li.css('box-shadow'), 'none')
        else assert.equal(li.css('box-shadow'), 'none')
      })
    })

    it('should goto SurveyList on back button click', () => {
      mockSuccessList()
      cy.visit('')
      cy.wait('@mockOkList')
      mockLoadSuccessResult()
      cy.visit('/surveys/any_id')
      cy.getByTestId('back-button').click()
      Helper.testUrl('/')
    })
  })

  describe('Save',() => {
    const mockUnexpectedError = (): void => Http.mockServerError(pathSurveyResult,'PUT')
    const mockAccessDiniedError = (): void => Http.mockForbiddenError(pathSurveyResult, 'PUT')

    beforeEach(() => {
      Helper.setLocalStorageItem('account', { accessToken: faker.datatype.uuid(), name: faker.name.findName() })
      mockLoadSuccessResult()
      cy.visit('/surveys/any_id')
      cy.wait('@mockOk')
    })

    it('should present error on UnexpectedError', () => {
      mockUnexpectedError()
      cy.get('li:nth-child(2)').click()
      cy.wait('@mockUnexpectedError')
      cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde')
    })

    it('should logout on AccessDiniedError', () => {
      mockAccessDiniedError()
      cy.get('li:nth-child(2)').click()
      Helper.testUrl('/login')
    })
  })
})
