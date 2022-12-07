import { AxiosHttpCliente } from './axios-http-client'
import axios from 'axios'
import faker from 'faker'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const makeSut = (): AxiosHttpCliente => {
  return new AxiosHttpCliente()
}

describe('AxiosHttpClient', () => {
  test('should call axios with correct URL and verb', async () => {
    const url = faker.internet.url()
    const sut = makeSut()
    await sut.post({
      url
    })
    expect(mockedAxios.post).toHaveBeenCalledWith(url)
  })
})
