import { act, render, screen } from '@testing-library/react'
import React from 'react'
import { SurveyResult } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'
import { LoadSurveyResultSpy, mockAccountModel, mockSurveyResultModel } from '@/domain/test'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = async (surveyResult = mockSurveyResultModel()): Promise<SutTypes> => {
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  loadSurveyResultSpy.surveyResult = surveyResult
  const getCurrentAccountMock = (): AccountModel => mockAccountModel()

  await act(async () => {
    render(
        <ApiContext.Provider value={{
          setCurrentAccount: jest.fn(),
          getCurrentAccount: getCurrentAccountMock
        }}>
          <SurveyResult loadSurveyResult={loadSurveyResultSpy}/>
        </ApiContext.Provider>
    )
  })

  return {
    loadSurveyResultSpy
  }
}

describe('SurveyResult Component', () => {
  test('Should present correct initial state', async () => {
    await makeSut(null)
    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = await makeSut()
    screen.getByTestId('survey-result')
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  test('Should present SurveyResult data on success',async () => {
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2019-10-05T00:00:00')
    })
    await makeSut(surveyResult)
    screen.getByTestId('survey-result')
    expect(screen.getByTestId('day')).toHaveTextContent('05')
    expect(screen.getByTestId('month')).toHaveTextContent('out')
    expect(screen.getByTestId('year')).toHaveTextContent('2019')
    expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question)
    expect(screen.getByTestId('answers').childElementCount).toBe(2)

    const answersWrap = screen.queryAllByTestId('answer-wrap')
    expect(answersWrap[0]).toHaveClass('active')
    expect(answersWrap[1]).not.toHaveClass('active')

    const images = screen.queryAllByTestId('image')
    expect(images[0]).toHaveAttribute('src', surveyResult.answers[0].image)
    expect(images[0]).toHaveAttribute('alt', surveyResult.answers[0].answer)
    expect(images[1]).toBeFalsy()
    const answers = screen.queryAllByTestId('answer')
    expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer)
    expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer)
    const percents = screen.queryAllByTestId('percent')
    expect(percents[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
    expect(percents[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`)
  })
})
