import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import Signup from './signup'
import { AddAccountSpy, Helper, ValidationStub } from '@/presentation/test'
import faker from 'faker'
import { EmailInUseError } from '@/domain/errors'
import ApiContext from '@/presentation/contexts/api/api-context'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const addAccountSpy = new AddAccountSpy()
  const setCurrentAccountMock = jest.fn()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <Signup
          validation={validationStub}
          addAccount={addAccountSpy}
        />
      </Router>
    </ApiContext.Provider>
  )
  return {
    sut,
    addAccountSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (sut: RenderResult, name = faker.random.word(), email = faker.internet.email(), password = faker.internet.password(), passwordConfirmation = faker.internet.password()): Promise<void> => {
  Helper.populateField(sut, 'name', name)
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)
  Helper.populateField(sut, 'passwordConfirmation', passwordConfirmation)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('Signup Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut,'name', validationError)
    Helper.testStatusForField(sut,'email', validationError)
    Helper.testStatusForField(sut,'password', validationError)
    Helper.testStatusForField(sut,'passwordConfirmation', validationError)
  })

  test('should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut,'name', validationError)
  })

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut,'email', validationError)
  })

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut,'password', validationError)
  })

  test('should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut,'passwordConfirmation', validationError)
  })

  test('should show valid name state if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut,'name')
  })

  test('should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut,'email')
  })

  test('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut,'password')
  })

  test('should show valid passwordConfirmation state if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut,'passwordConfirmation')
  })

  test('should desabled submit buttton if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'name')
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testButtonIsDisabled(sut, 'submit', true)
  })

  test('should enable submit buttton if form is valid', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name')
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testButtonIsDisabled(sut, 'submit', false)
  })

  test('should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    Helper.testElementExists(sut,'spinner')
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    const passwordConfirmation = faker.internet.password()
    await simulateValidSubmit(sut,name, email, password, passwordConfirmation)
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation
    })
  })

  test('should call AddAccount only once', async () => {
    const { sut, addAccountSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('should not call AddAccount if form is invalid', async () => {
    const validationError = faker.random.words()
    const { sut, addAccountSpy } = makeSut({ validationError })
    await simulateValidSubmit(sut)
    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('should present error if AddAccount fails', async () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    Helper.testElementText(sut,'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })

  test('should call updateCurrentAccount on success', async () => {
    const { sut, addAccountSpy, setCurrentAccountMock } = makeSut()
    await simulateValidSubmit(sut)
    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to Login page', async () => {
    const { sut } = makeSut()
    const loginLink = sut.getByTestId('login-link')
    fireEvent.click(loginLink)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/login')
  })
})
