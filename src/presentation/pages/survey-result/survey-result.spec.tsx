import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { SurveyResult } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'
import { LoadSurveyResultSpy, mockAccountModel, mockSurveyResultModel, SaveSurveyResultSpy } from '@/domain/test'
import { AccountModel } from '@/domain/models'
import { AccessDiniedError, UnexpectedError } from '@/domain/errors'
import { MemoryHistory, createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy
  saveSurveyResultSpy?: SaveSurveyResultSpy
}

const makeSut = async ({ loadSurveyResultSpy = new LoadSurveyResultSpy(), saveSurveyResultSpy = new SaveSurveyResultSpy() }: SutParams = {}): Promise<SutTypes> => {
  const history = createMemoryHistory({ initialEntries: ['/', '/surveys/any_id'], initialIndex: 1 })
  const getCurrentAccountMock = (): AccountModel => mockAccountModel()
  const setCurrentAccountMock = jest.fn()
  await act(async () => {
    render(
        <ApiContext.Provider value={{
          setCurrentAccount: setCurrentAccountMock,
          getCurrentAccount: getCurrentAccountMock
        }}>
          <Router history={history}>
            <SurveyResult
              loadSurveyResult={loadSurveyResultSpy}
              saveSurveyResult={saveSurveyResultSpy}
            />
          </Router>
        </ApiContext.Provider>
    )
  })

  return {
    loadSurveyResultSpy,
    saveSurveyResultSpy,
    history,
    setCurrentAccountMock
  }
}

describe('SurveyResult Component', () => {
  test('Should present correct initial state', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    loadSurveyResultSpy.surveyResult = null
    await makeSut({ loadSurveyResultSpy })
    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should call LoadSurveyResult', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    await makeSut({ loadSurveyResultSpy })
    screen.getByTestId('survey-result')
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  test('Should present SurveyResult data on success',async () => {
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2019-10-05T00:00:00')
    })
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    loadSurveyResultSpy.surveyResult = surveyResult
    await makeSut({ loadSurveyResultSpy })
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

  test('Should error on UnexpectedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyResultSpy,'load').mockRejectedValueOnce(error)
    await makeSut({ loadSurveyResultSpy })
    expect(screen.queryByTestId('question')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should redirect to login page if access denied', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const error = new AccessDiniedError()
    jest.spyOn(loadSurveyResultSpy,'load').mockRejectedValueOnce(error)
    const { history, setCurrentAccountMock } = await makeSut({ loadSurveyResultSpy })
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should call LoadSurveyResult on reload', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest.spyOn(loadSurveyResultSpy,'load').mockRejectedValueOnce(new UnexpectedError())
    await makeSut({ loadSurveyResultSpy })
    // await act(async () => {
    fireEvent.click(screen.getByTestId('reload'))
    // })
    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    await waitFor(() => screen.queryAllByTestId('answer-wrap'))
    expect(loadSurveyResultSpy.callsCount).toBe(1)
    screen.getByTestId('survey-result')
  })

  test('Should goto SurveyList on back button click', async () => {
    const { history } = await makeSut()
    fireEvent.click(screen.getByTestId('back-button'))
    expect(history.location.pathname).toBe('/')
  })

  test('Should not present Loading on active asnwer click', async () => {
    await makeSut()
    const answersWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answersWrap[0])
    await waitFor(() => screen.queryAllByTestId('answer-wrap'))
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should call SaveSurveyResult on non active asnwer click', async () => {
    const { saveSurveyResultSpy, loadSurveyResultSpy } = await makeSut()
    const answersWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answersWrap[1])
    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    await waitFor(() => screen.queryAllByTestId('answer-wrap'))
    expect(saveSurveyResultSpy.params).toEqual({
      answer: loadSurveyResultSpy.surveyResult.answers[1].answer
    })
  })

  test('Should error on UnexpectedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(saveSurveyResultSpy,'save').mockRejectedValueOnce(error)
    await makeSut({ saveSurveyResultSpy })
    const answersWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answersWrap[1])
    await waitFor(() => screen.queryAllByTestId('answer-wrap'))
    expect(screen.queryByTestId('question')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should redirect to login page if access denied', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const error = new AccessDiniedError()
    jest.spyOn(saveSurveyResultSpy,'save').mockRejectedValueOnce(error)
    const { history, setCurrentAccountMock } = await makeSut({ saveSurveyResultSpy })
    const answersWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answersWrap[1])
    await waitFor(() => screen.queryAllByTestId('answer-wrap'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should present SurveyResult data on SaveSurveyResult success',async () => {
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2023-03-12T00:00:00')
    })
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    saveSurveyResultSpy.surveyResult = surveyResult
    await makeSut({ saveSurveyResultSpy })
    screen.getByTestId('survey-result')
    const answersWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answersWrap[1])
    await waitFor(() => screen.queryAllByTestId('answer-wrap'))
    expect(screen.getByTestId('day')).toHaveTextContent('12')
    expect(screen.getByTestId('month')).toHaveTextContent('mar')
    expect(screen.getByTestId('year')).toHaveTextContent('2023')
    expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question)
    expect(screen.getByTestId('answers').childElementCount).toBe(2)
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
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should prevent multiple answer click',async () => {
    const { saveSurveyResultSpy } = await makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))
    const answersWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answersWrap[1])
    fireEvent.click(answersWrap[1])
    await waitFor(() => screen.getByTestId('survey-result'))
    expect(saveSurveyResultSpy.callsCount).toBe(1)
  })
})
