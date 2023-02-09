import * as FormHelper from '../support/form-helper'

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
})
