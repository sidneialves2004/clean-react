import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Signup from './signup'
import { Helper } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(
      <Signup />
  )
  return {
    sut
  }
}

describe('Signup Component', () => {
  test('Should start with initial state', () => {
    const validationError = 'Campo Obrigatório'
    const { sut } = makeSut()
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut,'name', validationError)
    Helper.testStatusForField(sut,'email', validationError)
    Helper.testStatusForField(sut,'password', validationError)
    Helper.testStatusForField(sut,'passwordConfirmation', validationError)
  })
})
