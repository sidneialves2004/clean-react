import { HttpClientSpy } from '@/data/test'
import { RemoteSaveSurveyResult } from '@/data/usecases'
import { SaveSurveyResult } from '@/domain/usecases'
import faker from 'faker'

type SutTypes = {
  sut: RemoteSaveSurveyResult
  httpClientSpy: HttpClientSpy<RemoteSaveSurveyResult.Result>
}

const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => (
  { answer: faker.random.words(10) }
)

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteSaveSurveyResult.Result>()
  const sut = new RemoteSaveSurveyResult(url, httpClientSpy)
  return {
    sut,
    httpClientSpy
  }
}

describe('RemoteSaveSurveyResult', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    const params = mockSaveSurveyResultParams()
    await sut.save(params)
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('put')
    expect(httpClientSpy.body).toEqual(params)
  })
})
