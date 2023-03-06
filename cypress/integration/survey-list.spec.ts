import faker from 'faker'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /api\/surveys/

enum iconResult {
  thumbDown = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFKADAAQAAAABAAAAEgAAAAA9nQVdAAAA70lEQVQ4Ea2RPQoCQQyFZ/w5g72lYOEVPIiV2IkIHmCvIZ5D77BgZWtrYWe1ICiuL8tEwjIZZmYNZCf7knyTzRrjrK7rAfwAr+AheyNZwiei98gNrBkISxYjz5KbZb0V4gXxlN8jzo+1tk91BOT6nhPmOFNg1Nb0UiCNxY0Uu8QW044BuMIZHs3DJzcra3/yOgem3UoT3pEcaQUh3TchAX9/KNTsy/mAtLebrzhXI+AqE/oQl55ErIfYxp5WothW71QyAJ0VWKG06DJAQ/jTA0yH0TUAzf4Gc8BFC5g3GcHI3IQvBy0asesDsB08CfYFB/44kX6+Hj8AAAAASUVORK5CYII=',
  thumbUp = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFKADAAQAAAABAAAAEgAAAAA9nQVdAAAA0klEQVQ4EWNgIAH8//+/AYhLSNCCWynUMCD1/zcQG+BWSYQMkmEgA0Egjght2JUANYO8iQ4MsasmIAo0BZthP4DirAS0YkrjMAzk0tOYqgmIADUVgnTiADPxakfStAWmECj2DkmcWOYjoEJPRpBqmEGMQABiI4vB5IikH1PbQAYmIm0mVtlLahu4nJpe/gf0hho1XbgVGKd3qWngRFBA4/LyX6AcKZZdBbpOB2QgLk1nQJIkgElwtaBEDAXIOUULKHYSiP/CJHHQX4Hic4CYBWYgADx8PyqFiuhJAAAAAElFTkSuQmCC'
}
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

const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET')
const mockAccessDiniedError = (): void => Http.mockForbiddenError(path, 'GET')
const mockSuccess = (): void => Http.mockOk(path, 'GET', surveyList, 1000)

describe('SurveyList', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', { accessToken: faker.datatype.uuid(), name: faker.name.findName() })
  })

  it('should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde')
  })

  it('should reload on button click', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.getByTestId('error').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde')
    mockSuccess()
    cy.getByTestId('reload').click()
    cy.wait('@mockOk')
    cy.get('li:not(empty)').should('have.length', 2)
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

  it('should present survey items', () => {
    mockSuccess()
    cy.visit('')
    cy.get('li:empty').should('have.length', 4)
    cy.wait('@mockOk')
    cy.get('li:not(empty)').should('have.length', 2)
    cy.get('li:nth-child(1)').then(li => {
      assert.equal(li.find('[data-testid="day"]').text(), '03')
      assert.equal(li.find('[data-testid="month"]').text(), 'fev')
      assert.equal(li.find('[data-testid="year"]').text(), '2018')
      assert.equal(li.find('[data-testid="question"]').text(), 'Question 1')
      assert.equal(li.find('[data-testid="icon"]').attr('src'), iconResult.thumbUp)
    })

    cy.get('li:nth-child(2)').then(li => {
      assert.equal(li.find('[data-testid="day"]').text(), '13')
      assert.equal(li.find('[data-testid="month"]').text(), 'nov')
      assert.equal(li.find('[data-testid="year"]').text(), '2020')
      assert.equal(li.find('[data-testid="question"]').text(), 'Question 2')
      assert.equal(li.find('[data-testid="icon"]').attr('src'), iconResult.thumbDown)
    })
  })
})
