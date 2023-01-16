import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import 'jest-localstorage-mock'
import { render, RenderResult } from '@testing-library/react'

import Start from './start'

type SutTypes = {
  sut: RenderResult
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (): SutTypes => {
  const sut = render(
    <Router history={history}>
      <Start />
    </Router>
  )
  return {
    sut
  }
}

describe('Start Component', () => {
  test('should create Component', () => {
    const { sut } = makeSut()
    const container = sut.getByTestId('container')
    expect(container).toBeDefined()
  })
})
