import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { RemoteSaveSurveyResult } from '@/data/usecases'
import { AccessDiniedError, UnexpectedError } from '@/domain/errors'
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
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel()
    }
    const params = mockSaveSurveyResultParams()
    await sut.save(params)
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('put')
    expect(httpClientSpy.body).toEqual(params)
  })

  test('Should throw AccessDiniedError if HttpGetClient returns 403 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
      body: mockRemoteSurveyResultModel()
    }
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new AccessDiniedError())
  })

  test('Should throw UnexpectedError if HttpGetClient returns 404 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
      body: mockRemoteSurveyResultModel()
    }
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpGetClient returns 500 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
      body: mockRemoteSurveyResultModel()
    }
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return a SurveyResult on 200 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    const httpResult = mockRemoteSurveyResultModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const httpResponse = await sut.save(mockSaveSurveyResultParams())
    expect(httpResponse).toEqual({
      question: httpResult.question,
      answers: httpResult.answers,
      date: new Date(httpResult.date)
    })
  })
})
