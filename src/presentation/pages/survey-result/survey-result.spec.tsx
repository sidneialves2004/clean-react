import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { SurveyResult } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'
import { LoadSurveyResultSpy, mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultSpy = new LoadSurveyResultSpy()

  const getCurrentAccountMock = (): AccountModel => mockAccountModel()
  render(
  <ApiContext.Provider value={{
    setCurrentAccount: jest.fn(),
    getCurrentAccount: getCurrentAccountMock
  }}>
    <SurveyResult loadSurveyResult={loadSurveyResultSpy}/>
  </ApiContext.Provider>
  )

  return {
    loadSurveyResultSpy
  }
}

describe('SurveyResult Component', () => {
  test('Should present correct initial state', () => {
    makeSut()
    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should call LoadSurveyResult',async () => {
    const { loadSurveyResultSpy } = makeSut()
    waitFor(() => screen.getByTestId('survey-result'))
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })
})
