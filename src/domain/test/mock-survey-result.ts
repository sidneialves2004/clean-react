import faker from 'faker'
import { LoadSurveyResult } from '../usecases'

export const mockAnswer = (isCurrentAccountAnswer: boolean,image?: string): any => ({
  image,
  answer: faker.random.word(),
  count: faker.datatype.number(),
  percent: faker.datatype.number(100),
  isCurrentAccountAnswer
})

export const mockSurveyResultModel = (): LoadSurveyResult.ResultModel => ({
  question: faker.random.words(),
  date: faker.date.recent(),
  answers: [
    mockAnswer(true,faker.internet.url()),
    mockAnswer(false)
  ]
})

export class LoadSurveyResultSpy implements LoadSurveyResult {
  callsCount = 0
  surveyResult = mockSurveyResultModel()

  async load (): Promise<LoadSurveyResult.ResultModel> {
    this.callsCount++
    return this.surveyResult
  }
}
