import { HttpClientSpy, mockRemoteSurveyListModel } from '@/data/test'
import { RemoteLoadSurveyList } from '@/data/usecases'
import { HttpStatusCode } from '@/data/protocols/http'
import { AccessDiniedError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'

type SutTypes = {
  sut: RemoteLoadSurveyList
  httpClientSpy: HttpClientSpy<RemoteLoadSurveyList.SurveyModel[]>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadSurveyList.SurveyModel[]>()
  const sut = new RemoteLoadSurveyList(url, httpClientSpy)
  return {
    sut,
    httpClientSpy
  }
}

describe('RemoteLoadSurveyList', () => {
  test('Should call httpGetClient with correct url and method', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    await sut.loadAll()
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('get')
  })

  test('Should throw AccessDiniedError if HttpGetClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new AccessDiniedError())
  })

  test('Should throw UnexpectedError if HttpGetClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpGetClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return a list of SurveyModels if HttpGetClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut()
    const httpResult = mockRemoteSurveyListModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const survyeList = await sut.loadAll()
    expect(survyeList).toEqual([{
      id: httpResult[0].id,
      question: httpResult[0].question,
      didAnswer: httpResult[0].didAnswer,
      date: new Date(httpResult[0].date)
    },{
      id: httpResult[1].id,
      question: httpResult[1].question,
      didAnswer: httpResult[1].didAnswer,
      date: new Date(httpResult[1].date)
    },{
      id: httpResult[2].id,
      question: httpResult[2].question,
      didAnswer: httpResult[2].didAnswer,
      date: new Date(httpResult[2].date)
    }])
  })

  test('Should return an empty list if HttpGetClient returns 204', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    const survyeList = await sut.loadAll()
    expect(survyeList).toEqual([])
  })
})
