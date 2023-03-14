
import { mockAxios, mockHttpResponse } from '@/infra/test'
import axios from 'axios'
import { mockHttpRequest } from '@/data/test'
import { AxiosHttpClient } from '@/infra/http'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient()
  const mockedAxios = mockAxios()
  return {
    sut,
    mockedAxios
  }
}

describe('AxiosHttpClient', () => {
  describe('AxiosHttpPostClient', () => {
    test('should call axios with correct params and verb', async () => {
      const request = mockHttpRequest()
      const { sut, mockedAxios } = makeSut()
      await sut.request(request)
      expect(mockedAxios.request).toHaveBeenCalledWith({
        url: request.url,
        data: request.body,
        method: request.method,
        headers: request.headers
      })
    })

    test('Should return correct response', async () => {
      const { sut, mockedAxios } = makeSut()
      const httpResponse = await sut.request(mockHttpRequest())
      const axiosResponse = await mockedAxios.request.mock.results[0].value

      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
    })

    test('Should return correct error', () => {
      const { sut, mockedAxios } = makeSut()
      mockedAxios.request.mockRejectedValueOnce({
        response: mockHttpResponse()
      })

      const promise = sut.request(mockHttpRequest())
      expect(promise).toEqual(mockedAxios.request.mock.results[0].value)
    })

    test('should return the correct statusCode and body on failure', async () => {
      const { sut, mockedAxios } = makeSut()
      const statusError = 500
      const messageError = 'any_error'
      mockedAxios.request.mockRejectedValueOnce({
        status: statusError,
        message: messageError
      })
      const promise = sut.request(mockHttpRequest())
      expect(await promise).toEqual({
        statusCode: statusError,
        body: { error: messageError }
      })
    })

    test('Should return correct error if error.request', async () => {
      const { sut, mockedAxios } = makeSut()
      const errorRequest = { error: 'any_error' }
      mockedAxios.request.mockRejectedValueOnce({
        request: errorRequest
      })
      const promise = sut.request(mockHttpRequest())
      expect(await promise).toEqual({
        statusCode: 500,
        body: errorRequest
      })
    })
  })
})
