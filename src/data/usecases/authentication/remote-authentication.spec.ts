import { HttpPostClientSpy } from '@/data/test/mock-http-client'
import { AuthenticationParams } from '@/domain/usecases/authentication'
import { RemoteAuthentication } from './remote-authentication'

const mockAuthentication = (): AuthenticationParams => ({
  email: 'any@email.com',
  password: 'any_password'
})

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy
}

const makeSut = (url: string = 'any_url'): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)
  return {
    sut,
    httpPostClientSpy
  }
}
describe('RemoteAuthentication', () => {
  test('Should call HttpClient with correct URL', async () => {
    const url = 'any_url'
    const { sut, httpPostClientSpy } = makeSut()
    await sut.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    await sut.auth(mockAuthentication())
    expect(httpPostClientSpy.body).toEqual(mockAuthentication())
  })
})
