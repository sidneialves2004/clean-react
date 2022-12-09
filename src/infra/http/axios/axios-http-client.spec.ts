import { AxiosHttpCliente } from './axios-http-client'
import { mockAxios } from '@/infra/test'
import axios from 'axios'
import { mockPostRequest } from '@/data/test'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpCliente
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpCliente()
  const mockedAxios = mockAxios()
  return {
    sut,
    mockedAxios
  }
}

describe('AxiosHttpClient', () => {
  test('should call axios with correct params and verb', async () => {
    const request = mockPostRequest()
    const { sut, mockedAxios } = makeSut()
    await sut.post(request)
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('should return the correct statusCode and body', () => {
    const { sut, mockedAxios } = makeSut()
    const promise = sut.post(mockPostRequest())
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
