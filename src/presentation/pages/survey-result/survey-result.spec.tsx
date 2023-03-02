import { render, screen } from '@testing-library/react'
import React from 'react'
import { SurveyResult } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'
import { mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models'

describe('SurveyResult Component', () => {
  test('Should present correct initial state', () => {
    const getCurrentAccountMock = (): AccountModel => mockAccountModel()
    render(
    <ApiContext.Provider value={{
      setCurrentAccount: jest.fn(),
      getCurrentAccount: getCurrentAccountMock
    }}>
      <SurveyResult />
    </ApiContext.Provider>
    )
    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })
})
