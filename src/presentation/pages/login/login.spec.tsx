import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AuthenticationSpy, ValidationStub, Helper } from '@/presentation/test'
import { Login } from '@/presentation/pages'
import faker from 'faker'
import { InvalidCredentialsError } from '@/domain/errors'
import { ApiContext } from '@/presentation/contexts'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  validationError: string
}
const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const setCurrentAccountMock = jest.fn()
  validationStub.errorMessage = params?.validationError
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <Login
            validation={validationStub}
            authentication={authenticationSpy}
        />
      </Router>
    </ApiContext.Provider>
  )
  return {
    authenticationSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField('email', email)
  Helper.populateField('password', password)
  const form = screen.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
    expect(screen.getByTestId('submit')).toBeDisabled()
    // Helper.testButtonIsDisabled('submit', true)
    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
  })

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.populateField('email')
    Helper.testStatusForField('email', validationError)
  })

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.populateField('password')
    Helper.testStatusForField('password', validationError)
  })

  test('should show valid email state if if Validation succeeds', () => {
    makeSut()
    Helper.populateField('email')
    Helper.testStatusForField('email')
  })

  test('should show valid password state if if Validation succeeds', () => {
    makeSut()
    Helper.populateField('password')
    Helper.testStatusForField('password')
  })

  test('should enable submit buttton if form is valid', () => {
    makeSut()
    Helper.populateField('email')
    Helper.populateField('password')
    expect(screen.getByTestId('submit')).toBeEnabled()
    // Helper.testButtonIsDisabled('submit', false)
  })

  test('should show spinner on submit', async () => {
    makeSut()
    await simulateValidSubmit()
    expect(screen.queryByTestId('spinner')).toBeInTheDocument()
  })

  test('should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('should call Authentication only once', async () => {
    const { authenticationSpy } = makeSut()
    await simulateValidSubmit()
    await simulateValidSubmit()
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const { authenticationSpy } = makeSut({ validationError })
    await simulateValidSubmit()
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit()
    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message)
    expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
  })

  test('should call UpdateCurrentAccount on success', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut()
    await simulateValidSubmit()
    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to signup page', async () => {
    makeSut()
    const register = screen.getByTestId('signup-link')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})

// import React from 'react'
// import { Router } from 'react-router-dom'
// import { createMemoryHistory } from 'history'
// import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
// import { AuthenticationSpy, SaveAccessTokenMock, ValidationStub, Helper } from '@/presentation/test'
// import { Login } from '@/presentation/pages'
// import faker from 'faker'
// import { InvalidCredentialsError } from '@/domain/errors'

// type SutTypes = {
//   sut: RenderResult
//   authenticationSpy: AuthenticationSpy
//   saveAccessTokenMock: SaveAccessTokenMock
// }

// type SutParams = {
//   validationError: string
// }
// const history = createMemoryHistory({ initialEntries: ['/login'] })

// const makeSut = (params?: SutParams): SutTypes => {
//   const validationStub = new ValidationStub()
//   const authenticationSpy = new AuthenticationSpy()
//   const saveAccessTokenMock = new SaveAccessTokenMock()
//   validationStub.errorMessage = params?.validationError
//   const sut = render(
//     <Router history={history}>
//       <Login
//           validation={validationStub}
//           authentication={authenticationSpy}
//           saveAccessToken={saveAccessTokenMock}
//       />
//     </Router>
//   )
//   return {
//     sut,
//     authenticationSpy,
//     saveAccessTokenMock
//   }
// }

// const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
//   Helper.populateField(sut, 'email', email)
//   Helper.populateField(sut, 'password', password)
//   const form = sut.getByTestId('form')
//   fireEvent.submit(form)
//   await waitFor(() => form)
// }

// describe('Login Component', () => {
//   afterEach(cleanup)

//   test('Should start with initial state', () => {
//     const validationError = faker.random.words()
//     const { sut } = makeSut({ validationError })
//     Helper.testChildCount(sut, 'error-wrap', 0)
//     Helper.testButtonIsDisabled(sut, 'submit', true)
//     Helper.testStatusForField(sut,'email', validationError)
//     Helper.testStatusForField(sut,'password', validationError)
//   })

//   test('should show email error if Validation fails', () => {
//     const validationError = faker.random.words()
//     const { sut } = makeSut({ validationError })
//     Helper.populateField(sut, 'email')
//     Helper.testStatusForField(sut,'email', validationError)
//   })

//   test('should show password error if Validation fails', () => {
//     const validationError = faker.random.words()
//     const { sut } = makeSut({ validationError })
//     Helper.populateField(sut, 'password')
//     Helper.testStatusForField(sut,'password', validationError)
//   })

//   test('should show valid email state if if Validation succeeds', () => {
//     const { sut } = makeSut()
//     Helper.populateField(sut, 'email')
//     Helper.testStatusForField(sut,'email')
//   })

//   test('should show valid password state if if Validation succeeds', () => {
//     const { sut } = makeSut()
//     Helper.populateField(sut, 'password')
//     Helper.testStatusForField(sut,'password')
//   })

//   test('should enable submit buttton if form is valid', () => {
//     const { sut } = makeSut()
//     Helper.populateField(sut, 'email')
//     Helper.populateField(sut, 'password')
//     Helper.testButtonIsDisabled(sut, 'submit', false)
//   })

//   test('should show spinner on submit', async () => {
//     const { sut } = makeSut()
//     await simulateValidSubmit(sut)
//     Helper.testElementExists(sut,'spinner')
//   })

//   test('should call Authentication with correct values', async () => {
//     const { sut, authenticationSpy } = makeSut()
//     const email = faker.internet.email()
//     const password = faker.internet.password()
//     await simulateValidSubmit(sut, email, password)
//     expect(authenticationSpy.params).toEqual({
//       email,
//       password
//     })
//   })

//   test('should call Authentication only once', async () => {
//     const { sut, authenticationSpy } = makeSut()
//     await simulateValidSubmit(sut)
//     await simulateValidSubmit(sut)
//     expect(authenticationSpy.callsCount).toBe(1)
//   })

//   test('should not call Authentication if form is invalid', async () => {
//     const validationError = faker.random.words()
//     const { sut, authenticationSpy } = makeSut({ validationError })
//     await simulateValidSubmit(sut)
//     expect(authenticationSpy.callsCount).toBe(0)
//   })

//   test('should present error if Authentication fails', async () => {
//     const { sut, authenticationSpy } = makeSut()
//     const error = new InvalidCredentialsError()
//     jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
//     await simulateValidSubmit(sut)
//     Helper.testElementText(sut,'main-error', error.message)
//     Helper.testChildCount(sut, 'error-wrap', 1)
//   })

//   test('should call SaveAccessToken on success', async () => {
//     const { sut, authenticationSpy, saveAccessTokenMock } = makeSut()
//     await simulateValidSubmit(sut)
//     expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
//     expect(history.length).toBe(1)
//     expect(history.location.pathname).toBe('/')
//   })

//   test('should present error if SaveAccessToken fails', async () => {
//     const { sut, saveAccessTokenMock } = makeSut()
//     const error = new InvalidCredentialsError()
//     jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error))
//     await simulateValidSubmit(sut)
//     Helper.testElementText(sut,'main-error', error.message)
//     Helper.testChildCount(sut, 'error-wrap', 1)
//   })

//   test('should go to signup page', async () => {
//     const { sut } = makeSut()
//     const register = sut.getByTestId('signup-link')
//     fireEvent.click(register)
//     expect(history.length).toBe(2)
//     expect(history.location.pathname).toBe('/signup')
//   })
// })
